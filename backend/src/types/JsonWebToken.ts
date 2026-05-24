type JsonWebToken = {
  header: {
    alg: string;
    typ: string;
  };

  payload: {
    iat: number;
    uid: string;
    prm: number;
    exp: number;
  };

  signature: string
};

export default JsonWebToken;
