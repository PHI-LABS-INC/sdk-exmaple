# PHI SDK Example

This project demonstrates the usage of the PHI SDK for creating and verifying credentials (Creds) and artworks (Arts) using the PHI protocol.

## Features

- Create Merkle-based Creds
- Create Signature-based Creds
- Create Image-based Arts
- Create API-based Arts
- Set up verifiers for Creds

## Deploy Your Own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/your-username/phi-sdk-example&project-name=phi-sdk-example&repository-name=phi-sdk-example&env=SIGNER_PRIVATE_KEY,BASESCAN_API_KEY)

## How to Use

This repository provides examples for creating verifier endpoints, Creds, and Artworks using the PHI SDK. Follow these steps to use the project:

0. Install Dependencies

- bun install

1. Set up environment variables:

   - Copy `.env.sample` to `.env` and fill in the required values.
   - Ensure `BASESCAN_API_KEY` is set for Etherscan API calls.

2. Create Verifier Endpoint:

   - Implement verifier logic in `api/verify/[id].ts` for each Cred type.
   - Use the `credVerifyEndpoint` object in `src/cred/credConfig.ts` to map Cred IDs to their respective verifier endpoints.

3. Create Cred:

   - Use the `credConfig` object in `src/cred/credConfig.ts` to define Cred configurations.
   - (Implement Cred creation logic in `src/cred/createCredRequest.ts`.)

4. Create Artwork:

   - Use the `artSettings` object in `src/art/artConfig.ts` to define Art configurations.
   - (Implement Art creation logic in `src/art/createArtRequest.ts`.)
   - For API-based Arts, refer to `api/generate.ts` or `api/gif.ts` for endpoint implementation examples.

5. Run script
   - bun run src/main.ts

### Example Configurations

#### Cred Configuration (src/cred/credConfig.ts):

```typescript
export const credConfig: { [key: number]: CredConfig } = {
  0: {
    title: 'Number of transactions on Basechain',
    requirement: 'Execute any transaction on Basechain',
    credType: 'ADVANCED',
    verificationType: 'SIGNATURE',
    // ... other properties
  },
  // ... other Cred configurations
};

export const credVerifyEndpoint: { [key: number]: string | undefined } = {
  0: 'https://phi-sdk.vercel.app/api/verify/0',
  // ... other verifier endpoints
};
```

#### Art Configuration (src/art/artConfig.ts):

```typescript
export const artSettings: { [key: number]: ArtSetting } = {
  0: {
    name: 'Base Transaction Art',
    description: 'Art representing transactions on Basechain',
    artType: 'IMAGE',
    // ... other properties
  },
  // ... other Art configurations
};
```

### Test

```
bun run test
```

#### Project Structure

- src/cred/: Contains functions for creating Creds
- src/art/: Contains functions for creating Arts
- src/verifier/: Contains functions for setting up verifiers
- src/utils/: Contains utility functions and configuration
- api/: Contains API endpoints for verifying Creds and generating images
- public/assets/: Contains sample images and fonts
- csv/: Contains sample CSV files for Merkle-based Creds

#### License

This project is licensed under the MIT License - see the LICENSE.md file for details.
