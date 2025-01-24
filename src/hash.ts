const hash: { [key: string]: string } = window.location.hash
  .substring(1)
  .split("&")
  .reduce((initial: { [key: string]: string }, item) => {
    if (item) {
      const parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

window.location.hash = "";
export default hash;
