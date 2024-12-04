const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();
    return { token, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the correct name, symbol, and decimals", async function () {
      const { token } = await deployTokenFixture();
      expect(await token.name()).to.equal("Testing Token");
      expect(await token.symbol()).to.equal("TT");
      expect(await token.decimals()).to.equal(6);
    });

    it("Should assign the total supply to the owner", async function () {
      const { token, owner } = await deployTokenFixture();
      const totalSupply = await token.totalSupply();
      expect(await token.balanceOf(owner.address)).to.equal(totalSupply);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { token, owner, addr1 } = await deployTokenFixture();
      const amount = ethers.utils.parseUnits("100", 6);
      await token.transfer(addr1.address, amount);
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should fail if the sender does not have enough balance", async function () {
      const { token, addr1, addr2 } = await deployTokenFixture();
      const amount = ethers.utils.parseUnits("100", 6);
      await expect(
        token.connect(addr1).transfer(addr2.address, amount)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });

  describe("Allowances", function () {
    it("Should approve tokens for spending by another address", async function () {
      const { token, owner, addr1 } = await deployTokenFixture();
      const amount = ethers.utils.parseUnits("100", 6);
      await token.approve(addr1.address, amount);
      expect(await token.allowance(owner.address, addr1.address)).to.equal(amount);
    });

    it("Should transfer tokens on behalf of an owner", async function () {
      const { token, owner, addr1, addr2 } = await deployTokenFixture();
      const amount = ethers.utils.parseUnits("100", 6);
      await token.approve(addr1.address, amount);
      await token.connect(addr1).transferFrom(owner.address, addr2.address, amount);
      expect(await token.balanceOf(addr2.address)).to.equal(amount);
    });

    it("Should fail if the spender exceeds the allowance", async function () {
      const { token, owner, addr1, addr2 } = await deployTokenFixture();
      const amount = ethers.utils.parseUnits("100", 6);
      await token.approve(addr1.address, amount);
      const excessiveAmount = ethers.utils.parseUnits("200", 6);
      await expect(
        token.connect(addr1).transferFrom(owner.address, addr2.address, excessiveAmount)
      ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });
  });

  describe("Minting and Burning", function () {
    it("Should mint new tokens", async function () {
      const { token, owner } = await deployTokenFixture();
      const mintAmount = ethers.utils.parseUnits("1000", 6);
      await token.mint(owner.address, mintAmount);
      expect(await token.balanceOf(owner.address)).to.equal(
        mintAmount.add(await token.totalSupply())
      );
    });

    it("Should burn tokens", async function () {
      const { token, owner } = await deployTokenFixture();
      const burnAmount = ethers.utils.parseUnits("100", 6);
      await token.burn(burnAmount);
      expect(await token.totalSupply()).to.equal(
        (await token.totalSupply()).sub(burnAmount)
      );
    });

    it("Should fail to burn more tokens than balance", async function () {
      const { token, owner } = await deployTokenFixture();
      const burnAmount = ethers.utils.parseUnits("1000000", 6);
      await expect(token.burn(burnAmount)).to.be.revertedWith(
        "ERC20: burn amount exceeds balance"
      );
    });
  });
});
