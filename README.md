This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started Development

- After cloning the repo:
- Copy .env.sample to .env and add below env 
    - NEXTAUTH_SECRET
    - Get Google credential from [Google](https://console.cloud.google.com/apis/credentials?inv=1&invt=Abk_rw&project=xxxxxxxxx-xxxxxx)
        - Click Credential => Web client 1
            - GOOGLE_CLIENT_ID (Client ID)
            - GOOGLE_CLIENT_SECRET (Client Secret)
    - Get Livekit credential from [Livekit](https://cloud.livekit.io/projects/xxxxxxxxxx/settings/keys)
        - Click Other Keys => Dev from there get the below
            - LIVEKIT_API_URL
            - LIVEKIT_API_KEY
            - LIVEKIT_API_SECRET
            - NEXT_PUBLIC_LIVEKIT_WS_URL
    - Get AWS Credential from [AWS](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/security_credentials?section=IAM_credentials)
        - Create Access keys => Create access key => Application running on an AWS compute service => add tag `project=twitch`
            - AWS_REGION
            - AWS_ACCESS_KEY_ID
            - AWS_SECRET_ACCESS_KEY
- Run below to get 
    ```
    docker compose up -d --build
    ```
- Install node modules `npm i` use node `22.x.x`
- Generate codegen `npm run codegen`
- Create database and table 
    - `npm run db:generate`
    - `npm run db:migrate`
- Run local development `npm run dev`
    - Open [http://localhost:3000](http://localhost:3000) 
- Create two account by signup
- Generate keys & url from [Keys](http://localhost:3000/u/xxxxxxx/keys)
- Open OBS
    - Scenes => Create a name `OBS DEMO`
    - Sources => Screen Capture (Pipewire)
    - Settings => Stream => Custom Add below from the [Keys](http://localhost:3000/u/xxxxxxx/keys)
        - Server Url 
        - Stream Key