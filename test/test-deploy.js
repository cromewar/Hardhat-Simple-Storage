const { ethers } = require("hardhat");
const { expected, assert } = require("chai");

describe("SimpleStorage", () => {
	let simpleStorageFactory, simpleStorage;

	beforeEach(async () => {
		simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
		simpleStorage = await simpleStorageFactory.deploy();
	});

	it("Should starts with a favorite number of 0", async () => {
		const favoriteNumber = await simpleStorage.retrieve();
		assert.equal(favoriteNumber, 0);
	});

	it("Should update when we call store", async () => {
		const expectedValue = "7";
		const transactionResponse = await simpleStorage.store(7);
		await transactionResponse.wait(1);
		const currentValue = await simpleStorage.retrieve();
		assert.equal(currentValue.toString(), expectedValue);
	});
});
