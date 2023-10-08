// Handle the undefined case with process.env

declare namespace NodeJS {
  interface ProcessEnv {
    readonly CLIENT_PORT: string;
    readonly API_PORT: string;
    readonly DATABASE_URL: string;
    //   POSTGRES_HOST=postgres
    //   POSTGRES_PORT=5432
    //   POSTGRES_USER=root
    //   POSTGRES_PASSWORD=qwerty
    //   POSTGRES_DB=pong
    //   #42 api
    readonly FORTYTWO_APP_ID: string;
    readonly FORTYTWO_APP_SECRET: string;
    readonly FORTYTWO_CALLBACK_URL: string;
    //   FORTYTWO_REDIRECT_URL="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-5f07b2d346a35f7f39063962e91be91e4799040f9ebf27e73ff4d8b3050a37bf&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Fredirect&response_type=code"#posgresql

    //   #jwt
    readonly JWT_KEY: string;
    readonly TWO_FACTOR_AUTHENTICATION_APP_NAME: string;
  }
}
