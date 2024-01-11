function isValidAddress(address: string): boolean {
  const regex =
    /^(0x[a-fA-F0-9]{40}|bc1[a-zA-Z0-9]{59}|bc1[a-zA-Z0-9]{39}|[13][a-zA-Z0-9]{33})$/g;
  return regex.test(address);
}

export default isValidAddress;
