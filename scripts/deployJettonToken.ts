import { Address, toNano } from '@ton/core';
import { JettonToken } from '../build/JettonToken/JettonToken_JettonToken';
import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from '../utils/jetton-helpers';

export async function run(provider: NetworkProvider) {
    const jettonParams = {
        name: "Devtros Jetton",
        description: "A jetton for the Devtros community",
        symbol: "DVT",
        image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=108,fit=crop,q=95/mxB73zWb3ehPJOqZ/frame-4-YX4lkrwpp4FgoDZ6.png",
    };

    // Create content Cell
    let content = buildOnchainMetadata(jettonParams);

    const sampleJetton = provider.open(await JettonToken.fromInit(provider.sender().address as Address, content, 1000000000000000000n));

    await sampleJetton.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Mint',
            amount: 100000000000000000n,
            receiver: provider.sender().address as Address
        }
    );

    await provider.waitForDeploy(sampleJetton.address);

    // run methods on `sampleJetton`
}