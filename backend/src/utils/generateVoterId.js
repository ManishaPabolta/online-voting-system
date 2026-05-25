const generateVoterId = () => {
  const random =
    Math.floor(
      100000 + Math.random() * 900000
    );

  return `VOTER-${random}`;
};

export default generateVoterId;