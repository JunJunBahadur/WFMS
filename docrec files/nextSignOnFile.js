'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const { KJUR, KEYUTIL, X509 } = require('jsrsasign');
const CryptoJS = require('crypto-js');

const ccpPath = path.resolve(__dirname, '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join('/home/arjun/hyperledger/fabric-samples/docrec', 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        // Collect input parameters
        // user: who initiates this query, can be anyone in the wallet
        // filename: the file to be validated
        // certfile: the cert file owner who signed the document
        const user = process.argv[2];
        const prevUser = process.argv[3];
        const filename = process.argv[4];


        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists(user);
        if (!userExists) {
            console.log('An identity for the user ' + user + ' does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // calculate Hash from the file
        const fileLoaded = fs.readFileSync(path.resolve(__dirname,'../../../git\ Upload/noNode_fs/WFMS/api/storage/'+filename+'.zip'), 'utf8');
        var hashToAction = CryptoJS.SHA256(fileLoaded+filename).toString();
        console.log("Hash of the file: " + hashToAction);


        // retrieve record from ledger

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('docrec');

        // Submit the specified transaction.
        const result = await contract.evaluateTransaction('queryDocRecord', hashToAction+prevUser);
        console.log("Transaction has been evaluated");
        var resultJSON = JSON.parse(result);
        console.log("Previous Signature: " + resultJSON.signature);
        var prevSig = resultJSON.signature;
        console.log("");

        //Second key for storing signature

        const walletContents = await wallet.export(user);
        const userPrivateKey = walletContents.privateKey;

        var sig = new KJUR.crypto.Signature({"alg": "SHA256withECDSA"});
        sig.init(userPrivateKey, "");
        sig.updateHex(prevSig);
        var sigValueHex = sig.sign();
        var sigValueBase64 = new Buffer.from(sigValueHex, 'hex').toString('base64');
        console.log("Signature: " + sigValueBase64);

        // Submitting the transaction
        await contract.submitTransaction('createDocRecord', hashToAction+user, sigValueBase64);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();


    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
