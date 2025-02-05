const ethers = require('ethers');
const EthCrypto = require("eth-crypto");
require("dotenv").config({ path: __dirname + '/../.env' });

// contract instance
const contract = require("../artifacts/contracts/OpenBuildNFTv1.sol/OpenBuildNFTv1.json");
const contractInterface = contract.abi;

// Arbitrum Goerli
// const apiKey = process.env.ARB_GOERLI_API_KEY;
// const provider = new ethers.AlchemyProvider('arbitrum-goerli', apiKey)

// const privateKey = process.env.ARB_GOERLI_PVK;
// const signer = new ethers.Wallet(privateKey, provider)

// const nftInstance = new ethers.Contract(
//     process.env.CONTRACT_ADDRESS,
//     contractInterface,
//     signer
// );

// Sepolia
const network = "sepolia";
const provider = new ethers.InfuraProvider(
    network,
    process.env.INFURA_API_KEY
);
const signer = new ethers.Wallet(process.env.SEPOLIA_PVK, provider);

const nftInstance = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractInterface,
    signer
);

// constract mint parameters
const msg_signer_privKey = process.env.MSG_SIGNER_PRIVATE_KEY;
const msg_signer_pubKey = EthCrypto.publicKeyByPrivateKey(msg_signer_privKey);
const msg_signer_address = EthCrypto.publicKey.toAddress(msg_signer_pubKey);

const messageHash = EthCrypto.hash.keccak256([
    { type: "uint256", value: "25" },
]);
const signatureObj = EthCrypto.sign(msg_signer_privKey, messageHash);

const mint = async () => {
    console.log("Waiting for 5 blocks to confirm...");

    let to = "0x3061f83708b755FCCC71F9689F0512e7E63237C1";
    let nftId = 111;
    let userId = 222;
    let imgUrl = "https://www.example.com";
    let message = messageHash;
    let signature = signatureObj;
    let msgSigner = msg_signer_address;

    let mintTx = await nftInstance.safeMint(to, nftId, userId, imgUrl, message, signature, msgSigner)
    await mintTx.wait()
    console.log(`Your tx address: ${mintTx.hash}`)
};

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });