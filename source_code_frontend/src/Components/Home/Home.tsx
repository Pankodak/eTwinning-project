import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

type home = {
  isAuthenticated: boolean;
};

const Home: React.FC<home> = ({ isAuthenticated }) => {
  return (
    <main role="main">
      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">Necessary Skills and Instruments for Supply Chain Management</h1>
          <p className="lead text-muted">
           Informacja
          </p>
          {isAuthenticated && (
            <p>
              <Link className="btn btn-primary my-2" to="/admin/customers">
                Customers
              </Link>
              <Link className="btn btn-secondary my-2" to="/admin/suppliers">
                Suppliers
              </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
};
const mapStateToProps = (state: any) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Home);
