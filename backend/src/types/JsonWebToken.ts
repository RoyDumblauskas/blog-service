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

// default fallback JWT
// works fine for all calls that only need "guest" auth
// individual routes will fail if prm (permissions)
// are insufficient
export function defaultJWT() {
  return {
    header: {
      alg: "none",
      typ: "JWT",
    },
    payload: {
      iat: -1,
      uid: "",
      prm: 44,
      exp: -1
    },
    signature: ""
  }
}



export default JsonWebToken;
