import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import * as actions from "../../store/actions/index";
import axios from "axios";

import AddOrEditModal from "../AddOrEditModal/AddOrEditModal";
type admin = {
  isAuthenticated: boolean;
  token: string;
  onLogout: () => void;
};
const Admin: React.FC<admin> = ({ isAuthenticated, token, onLogout }) => {
  const history = useHistory();
  const { addToast } = useToasts();

  const { table } = useParams<{ table: string }>();
  const [tables, setTables] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [entryEdit, setEntryEdit] = useState(null);
  const [event] = useState(new CustomEvent("resetForm"));
  const [loading, setLoading] = useState(false);
  const downloadData = () => {
    const data = {
      token: token,
    };
    setLoading(true);
    axios
      .post(`api/${table}`, {
        data,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.code === 3) {
          addToast(response.data.msg, {
            appearance: "error",
            autoDismiss: true,
          });
          history.push("/");
          return onLogout();
        } else if (response.data.code === 1) {
          addToast(response.data.msg, {
            appearance: "success",
            autoDismiss: true,
          });
          setTables(response.data.records);
        }
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
        addToast(`${error.message}, contact admin`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };
  useEffect(() => {
    downloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteEntryHandler = (id: number) => {
    const data = {
      token: token,
    };
    setLoading(true);
    axios
      .delete(`api/${table}/${id}`, {
        data: data,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.code === 3) {
          addToast(response.data.msg, {
            appearance: "error",
            autoDismiss: true,
          });
          history.push("/");
          return onLogout();
        } else {
          addToast(response.data.msg, {
            appearance: response.data.code === 1 ? "success" : "error",
            autoDismiss: true,
          });
          if (response.data.code === 1) {
            setTables((prevTables) =>
              prevTables.filter((entry) => entry["id"] !== id)
            );
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        addToast(`${error.message}, contact admin`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };
  const showModalHandler = (edit: boolean, entry = null) => {
    setShowModal(true);
    setEdit(edit);
    setEntryEdit(entry);
    document.body.style.overflow = "hidden";
  };
  const hideModalHandler = () => {
    setShowModal(false);
    setEdit(false);
    setEntryEdit(null);
    document.body.style.overflow = "auto";
    window.dispatchEvent(event);
  };
  const submitNewEntryHandler = (
    edit: boolean,
    nameOfTheCompany: string,
    country: string,
    address: string,
    contact: string,
    tradeLines: string,
    branch: string,
    id?: number,
    quantityOfTrucks?: number,
    typeOfTrailer?: string
  ) => {
    let url = `api/${table}`;
    let data = {
      token: token,
      nameOfTheCompany: nameOfTheCompany,
      country: country,
      address: address,
      contact: contact,
      branch: branch,
      tradeLines: tradeLines,
      quantityOfTrucks: quantityOfTrucks,
      typeOfTrailer: typeOfTrailer,
    };
    if (!edit) {
      axios
        .patch(url, { data: data })
        .then((res) => {
          hideModalHandler();
          if (res.data.code === 3) {
            addToast(res.data.msg, {
              appearance: "error",
              autoDismiss: true,
            });
            history.push("/");
            return onLogout();
          }
          if (res.data.code === 2) {
            return addToast(res.data.msg, {
              appearance: "error",
              autoDismiss: true,
            });
          }
          let newEntry: any;
          newEntry = {
            id: res.data.id,
            name_of_the_company: data.nameOfTheCompany,
            country: data.country,
            address: data.address,
            contact: data.contact,
            branch: data.branch,
            trade_lines: data.tradeLines,
          };
          if (table.toLowerCase().includes("suppliers")) {
            newEntry = {
              id: res.data.id,
              name_of_the_company: data.nameOfTheCompany,
              country: data.country,
              address: data.address,
              contact: data.contact,
              branch: data.branch,
              trade_lines: data.tradeLines,
              quantity_of_trucks: quantityOfTrucks,
              type_of_trailer: data.typeOfTrailer,
            };
          }
          addToast(res.data.msg, {
            appearance: "success",
            autoDismiss: true,
          });
          setTables((prevTables) => {
            let newTables = prevTables.map((el) => el) as any[];
            newTables.push(newEntry);
            return newTables;
          });
        })
        .catch((err) => {
          addToast(`${err.message}, contact admin`, {
            appearance: "error",
            autoDismiss: true,
          });
        });
      return;
    }
    url += `/${id}`;
    axios
      .post(url, { data: data })
      .then((res) => {
        hideModalHandler();
        if (res.data.code === 3) {
          addToast(res.data.msg, {
            appearance: "error",
            autoDismiss: true,
          });
          history.push("/");
          return onLogout();
        }
        addToast(res.data.msg, {
          appearance: res.data.code === 1 ? "success" : "error",
          autoDismiss: true,
        });
        if (res.data.code === 1) {
          setTables((prevTables) => {
            let newTables = prevTables.map((el) => {
              if (Number(parseInt(el["id"])) === Number(id)) {
                const element = { ...el };
                element["name_of_the_company"] = data.nameOfTheCompany;
                element["country"] = data.country;
                element["address"] = data.address;
                element["contact"] = data.contact;
                element["branch"] = data.branch;
                element["trade_lines"] = data.tradeLines;
                if (table.toLowerCase().includes("suppliers")) {
                  element["quantity_of_trucks"] = quantityOfTrucks;
                  element["type_of_trailer"] = data.typeOfTrailer;
                }
                return element;
              }
              return el;
            });
            return newTables;
          });
        }
      })
      .catch((err) => {
        addToast(`${err.message}, contact admin`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };
  let tableEntries = tables.map((entry, index) => {
    let buffer = [];
    let i = 0;
    for (let key of Object.keys(entry)) {
      buffer.push(
        key === "id" ? (
          <th key={`${i}${index}`} scope="row">
            {entry[key]}
          </th>
        ) : (
          <td key={`${i}${index}`}>{entry[key]}</td>
        )
      );
      i++;
    }
    buffer.push(
      <td key={`${i + 1}${index}`}>
        <button
          type="button"
          className="btn btn-warning"
          onClick={() => showModalHandler(true, entry)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onDeleteEntryHandler(entry["id"])}
        >
          Delete
        </button>
      </td>
    );
    return buffer;
  });
  return (
    <>
      {
        <AddOrEditModal
          edit={edit}
          show={showModal}
          modalClose={hideModalHandler}
          table={table}
          info={entryEdit}
          submitNewEntry={(
            edit,
            nameOfTheCompany,
            country,
            address,
            contact,
            tradeLines,
            branch,
            id,
            typeOfTrailer?,
            quantityOfTrucks?
          ) =>
            submitNewEntryHandler(
              edit,
              nameOfTheCompany,
              country,
              address,
              contact,
              tradeLines,
              branch,
              id,
              quantityOfTrucks,
              typeOfTrailer
            )
          }
        />
      }
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Name of the company</th>
            <th scope="col">Country</th>
            <th scope="col">Address</th>
            <th scope="col">Contact</th>
            <th scope="col">Branch</th>
            {table.toLowerCase().includes("suppliers") && (
              <>
                <th scope="col">Type of trailer</th>
                <th scope="col">Quantity of trucks</th>
              </>
            )}
            <th scope="col">Trade lines</th>
            <th scope="col">
              <button
                type="button"
                className="btn btn-info"
                onClick={() => downloadData()}
                disabled={loading}
              >
                Refresh
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => showModalHandler(false)}
                disabled={loading}
              >
                Add Entry
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {!loading &&
            tables.length > 0 &&
            tables.map((_, index: number) => {
              return <tr key={tables[index]["id"]}>{tableEntries[index]}</tr>;
            })}
        </tbody>
      </table>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        tables.length === 0 && <p className="text-center">No data</p>
      )}
    </>
  );
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    onLogout: () => dispatch(actions.logout()),
  };
};

const mapStateToProps = (state: any) => {
  return {
    isAuthenticated: state.auth.token !== null,
    token: state.auth.token,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
