import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";

import BackDrop from "../BackDrop/BackDrop";
import { isBlank } from "../../shared/utility";
import "./AddOrEditModal.css";
type addOrEditModal = {
  modalClose: () => void;
  show: boolean;
  edit: boolean;
  table: string;
  info?: any;
  submitNewEntry: (
    edit: boolean,
    nameOfTheCompany: string,
    country: string,
    address: string,
    contact: string,
    tradeLines: string,
    branch: string,
    id?: number,
    typeOfTrailer?: string,
    quantityOfTrucks?: number
  ) => void;
};
const AddOrEditModal: React.FC<addOrEditModal> = ({
  modalClose,
  show,
  edit,
  table,
  info,
  submitNewEntry,
}) => {
  const { addToast } = useToasts();
  const [nameOfTheCompany, setNameOfTheCompany] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [branch, setBranch] = useState("");
  const [typeOfTrailer, setTypeOfTrailer] = useState("");
  const [quantityOfTrucks, setQuanityOfTrucks] = useState(0);
  const [tradeLines, setTradeLines] = useState("");
  const [id, setId] = useState(0);
  const resetForm = () => {
    setNameOfTheCompany("");
    setCountry("");
    setAddress("");
    setContact("");
    setBranch("");
    setTypeOfTrailer("");
    setQuanityOfTrucks(0);
    setTradeLines("");
    setId(0);
  };
  const setNameOfTheCompanyHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNameOfTheCompany(e.target.value);
  };
  const setCountryHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(e.target.value);
  };
  const setAddressHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };
  const setContactHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContact(e.target.value);
  };
  const setBranchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBranch(e.target.value);
  };
  const setTypeOfTrailerHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeOfTrailer(e.target.value);
  };
  const setQuanityOfTrucksHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = parseInt(e.target.value);
    if (!value || value < 0) value = 0;
    setQuanityOfTrucks(value);
  };
  const setTradeLinesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTradeLines(e.target.value);
  };
  const submitHandler = (e: any) => {
    e.preventDefault();
    const arrayToTest = [
      nameOfTheCompany,
      country,
      address,
      contact,
      tradeLines,
      branch,
    ];
    if (table.toLowerCase().includes("suppliers")) {
      arrayToTest.push(typeOfTrailer);
    }
    const valid = isBlank(arrayToTest);
    if (!valid)
      return addToast("Inputs cant be blank", {
        appearance: "error",
        autoDismiss: true,
      });
    resetForm();
    submitNewEntry(
      edit,
      nameOfTheCompany,
      country,
      address,
      contact,
      tradeLines,
      branch,
      id,
      typeOfTrailer,
      quantityOfTrucks
    );
  };
  useEffect(() => {
    window.addEventListener("resetForm", resetForm);

    // cleanup this component
    return () => {
      window.removeEventListener("resetForm", resetForm);
    };
  }, []);
  useEffect(() => {
    if (!info) return;

    setNameOfTheCompany(info["name_of_the_company"]);
    setCountry(info["country"]);
    setAddress(info["address"]);
    setContact(info["contact"]);
    setBranch(info["branch"]);
    setTradeLines(info["trade_lines"]);
    if (edit) setId(info["id"]);
    if (!table.toLowerCase().includes("suppliers")) return;
    setTypeOfTrailer(info["type_of_trailer"]);
    setQuanityOfTrucks(info["quantity_of_trucks"]);
  }, [info, table, edit]);
  return (
    <>
      <BackDrop show={show} modalClose={modalClose} />
      <div
        className="Modal"
        style={{
          transform: show ? "translateY(0)" : "translateY(-100vh)",
          opacity: show ? "1" : "0",
        }}
      >
        <form className="text-center">
          <h1>{edit ? "Edytuj" : "Nowy"} wpis</h1>
          <div className="form-group">
            <label htmlFor="name_of_the_company">Name of the company</label>
            <input
              type="text"
              className="form-control"
              id="name_of_the_company"
              placeholder="Name of the company"
              value={nameOfTheCompany}
              onChange={setNameOfTheCompanyHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              className="form-control"
              id="country"
              placeholder="Country"
              value={country}
              onChange={setCountryHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              placeholder="Address"
              value={address}
              onChange={setAddressHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="Contact">Contact</label>
            <input
              type="number"
              className="form-control"
              id="Contact"
              placeholder="Contact"
              value={contact}
              onChange={setContactHandler}
            />
          </div>
          <div className="form-group">
            <label htmlFor="branch">Branch</label>
            <input
              type="text"
              className="form-control"
              id="branch"
              placeholder="Branch"
              value={branch}
              onChange={setBranchHandler}
            />
          </div>

          {table.toLowerCase().includes("suppliers") && (
            <>
              <div className="form-group">
                <label htmlFor="type_of_trailer">Type of trailer</label>
                <input
                  type="text"
                  className="form-control"
                  id="type_of_trailer"
                  placeholder="Type of trailer"
                  value={typeOfTrailer}
                  onChange={setTypeOfTrailerHandler}
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity_of_trucks">Quantity of trucks</label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity_of_trucks"
                  placeholder="Quantity of trucks"
                  value={quantityOfTrucks}
                  onChange={setQuanityOfTrucksHandler}
                />
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="trade_lines">Trade lines</label>
            <input
              type="text"
              className="form-control"
              id="trade_lines"
              placeholder="Trade lines"
              value={tradeLines}
              onChange={setTradeLinesHandler}
            />
          </div>
          <button
            type="submit"
            className="btn btn-success"
            onClick={submitHandler}
          >
            Submit
          </button>
          <button
            type="submit"
            className="btn btn-danger"
            onClick={(e) => {
              e.preventDefault();
              modalClose();
            }}
          >
            Close
          </button>
        </form>
      </div>
    </>
  );
};

export default AddOrEditModal;
