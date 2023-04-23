type SvixErrorType = {
  detail: {
    loc: string[];
    msg: string;
    type: string;
  }[] | string;
};
