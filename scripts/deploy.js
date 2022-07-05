// imports
const { ethers, run, network } = require("hardhat");

// async main
async function main() {
	const SimpleStorageFactory = await ethers.getContractFactory(
		"SimpleStorage"
	);
	console.log("Deploying Contract..   ");
	const simpleStorage = await SimpleStorageFactory.deploy();
	// await until the contract is successfully deployed
	await simpleStorage.deployed();
	console.log(`Deployed contract to ${simpleStorage.address}`);
	// if deploy on hardhat network the contract does not need to get verified
	if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
		console.log("Waiting for block txes...");
		await simpleStorage.deployTransaction.wait(6);
		await verify(simpleStorage.address, []);
	}

	// Interacting with the contract

	const currentValue = await simpleStorage.retrieve();
	console.log(`Current value: ${currentValue}`);

	// Update the current value
	const transactionResponse = await simpleStorage.store(7);
	await transactionResponse.wait(1);
	const updatedValue = await simpleStorage.retrieve();
	console.log(`Updated value: ${updatedValue}`);
}

async function verify(contractAddress, args) {
	console.log("Verifying Contract...");
	try {
		await run("verify:verify", {
			address: contractAddress,
			constructorArguments: args,
		});
	} catch (err) {
		if (err.message.toLowerCase().includes("already verified")) {
			console.log("Contract already verified");
		} else {
			console.log(err);
		}
	}
}

// main
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
