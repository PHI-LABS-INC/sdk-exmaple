import { Hex } from 'viem';
import { createCredRequest } from './cred/createCredRequest';
import { createArtRequest } from './art/createArtRequest';
import { ArtManager, CredManager, CredChainId, ArtChainId } from '@phi-hub/sdk';
import { credConfig, credVerifyEndpoint } from './cred/credConfig';
import { executor, EXECUTOR_PRIVATE_KEY, verifier } from './config';
import { artSettings } from './art/artConfig';
import { loadExistingResults, ProcessResult, saveResults } from './utils/file';

async function main() {
  const privateKey = EXECUTOR_PRIVATE_KEY as Hex;
  console.log(`Processing executor: ${executor}`);

  const credChainId: CredChainId = 84532;
  const artChainId: ArtChainId = 84532;

  const credManager = new CredManager(privateKey, credChainId);
  const artManager = new ArtManager(privateKey, artChainId);

  let results = loadExistingResults();

  for (let configId = 0; configId <= 4; configId++) {
    try {
      console.log(`Processing cred config: ${configId}`);

      const config = credConfig[configId];
      if (!config) {
        console.log(`No config found for configId: ${configId}, skipping.`);
        continue;
      }

      let credCreator = executor;
      let credRequest = await createCredRequest(
        configId,
        executor,
        credCreator,
        config.network,
        config.verificationType === 'SIGNATURE' ? verifier : undefined,
        config.verificationType === 'SIGNATURE' ? credVerifyEndpoint[configId] : undefined,
      );

      const credId = await credManager.createCred(credRequest, credChainId);
      console.log(`Successfully processed configId: ${configId} with credID: ${credId}`);

      let result: ProcessResult = { configId, credId };

      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(`Processing art config: ${configId}`);
      const artSetting = artSettings[configId];
      if (artSetting) {
        let artRequest;
        const baseArtRequest = {
          name: artSetting.name,
          description: artSetting.description,
          externalURL: artSetting.externalURL,
          network: artChainId,
          executor,
          artist: artSetting.artist,
          receiver: artSetting.receiver,
          price: artSetting.price,
          maxSupply: artSetting.maxSupply,
          startDate: artSetting.startDate,
          endDate: artSetting.endDate,
          soulbound: artSetting.soulbound,
        };

        if (artSetting.artType === 'API_ENDPOINT') {
          artRequest = await createArtRequest({
            ...baseArtRequest,
            endpoint: artSetting.endpoint,
            previewInput: artSetting.previewInput,
          });
        } else if (artSetting.artType === 'IMAGE') {
          artRequest = await createArtRequest({
            ...baseArtRequest,
            imagePath: artSetting.imagePath,
          });
        } else {
          throw new Error(`Unsupported artType`);
        }

        const artId = await artManager.createArt(artRequest, credId, credChainId);
        console.log(`Successfully processed createArt for credID: ${credId} with artID: ${artId}`);
        console.log(`Art details: name - ${artSetting.name}, Tags - ${artSetting.tags.join(', ')}`);

        result.artId = Number(artId);
      } else {
        console.log(`No art setting found for configId ${configId}, skipping art creation.`);
      }

      // Update or add the result
      const existingIndex = results.findIndex((r) => r.configId === configId);
      if (existingIndex !== -1) {
        results[existingIndex] = result;
      } else {
        results.push(result);
      }

      // Save results after each successful processing
      saveResults(results);
    } catch (error) {
      console.error(`Error processing configId ${configId}:`, error);
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

main()
  .then(() => console.log('All processing completed.'))
  .catch((error) => console.error('Error in main process:', error));
