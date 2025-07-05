import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Address } from '@ton/core';
import { JettonToken } from '../build/JettonToken/JettonToken_JettonToken';
import { buildOnchainMetadata } from '../utils/jetton-helpers';
import '@ton/test-utils';

describe('JettonToken', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let jettonToken: SandboxContract<JettonToken>;

     beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        const metadata = {
            name: "Test Jetton",
            description: "Jetton for testing",
            image: "https://ipfs.io/ipfs/QmFakeImage",
            symbol: "TJET",
        };

        const content = buildOnchainMetadata(metadata);
        const maxSupply = 1_000_000_000_000n;

        jettonToken = blockchain.openContract(await JettonToken.fromInit(deployer.address, content, maxSupply));

        const deployResult = await jettonToken.send(deployer.getSender(), {
            value: toNano('0.05'),
        }, {
            $$type: 'Mint',
            amount: 0n,
            receiver: deployer.address
        });

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonToken.address,
            deploy: true,
            success: true,
        });
    });

    it('should mint using Mint message', async () => {
        const mintAmount = 1_000_000_000n;

        const result = await jettonToken.send(deployer.getSender(), {
            value: toNano('0.05'),
        }, {
            $$type: 'Mint',
            amount: mintAmount,
            receiver: deployer.address
        });

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonToken.address,
            success: true
        });

        const data = await jettonToken.getGetJettonData();
        expect(data.totalSupply).toBe(mintAmount);
        expect(data.owner.toString()).toEqual(deployer.address.toString());

        const mintable = await jettonToken.getIsMintable();
        expect(mintable).toBe(true);
    });

    it('should mint using MintPublic', async () => {
        const mintAmount = 123_456_789n;
        const minter = await blockchain.treasury('minter');

        const result = await jettonToken.send(minter.getSender(), {
            value: toNano('0.05'),
        }, {
            $$type: 'MintPublic',
            amount: mintAmount
        });

        expect(result.transactions).toHaveTransaction({
            from: minter.address,
            to: jettonToken.address,
            success: true
        });

        const data = await jettonToken.getGetJettonData();
        expect(data.totalSupply).toBe(mintAmount);

        const mintable = await jettonToken.getIsMintable();
        expect(mintable).toBe(true);
    });

    it('should disable minting after MintClose', async () => {
        const closeResult = await jettonToken.send(deployer.getSender(), {
            value: toNano('0.05'),
        }, 'Owner: MintClose');

        expect(closeResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jettonToken.address,
            success: true,
        });

        const mintable = await jettonToken.getIsMintable();
        expect(mintable).toBe(false);
    });
});
