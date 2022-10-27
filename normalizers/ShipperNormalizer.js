exports.normalize = (shipper) => {
  return {
    id: shipper._id,
    firstname: shipper.firstname,
    lastname: shipper.lastname,
    postalCodes: shipper.postalCodes,
  };
};
