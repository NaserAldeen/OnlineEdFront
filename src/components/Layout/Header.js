import React, { Component } from "react";
import { Layout, Button } from "antd";
import { connect } from "react-redux";
import { LogoutOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { logout } from "../../store/actions/auth";
import { Select } from "antd";
import CartModal from "./CartModal";
const { Header } = Layout;

class LayoutHeader extends Component {
  state = {
    cartModalOpen: false,
  };
  render() {
    const { t, s } = this.props;
    const { cartModalOpen } = this.state;

    return (
      <Header
        className="site-layout-background"
        style={{ padding: 0, backgroundColor: "#0099cc" }}
      >
        {this.props.cart.length > 0 && (
          <CartModal
            visible={cartModalOpen}
            onClose={() => this.setState({ cartModalOpen: false })}
          />
        )}
        <div
          style={{
            float: "left",
            marginLeft: 15,
          }}
        >
          <Button
            type="link"
            style={{ color: "white" }}
            onClick={() => this.setState({ cartModalOpen: true })}
            title="Logout"
          >
            <ShoppingCartOutlined style={{ fontSize: 22 }} />{" "}
            {this.props.total > 0 && (
              <span className="mx-2">{this.props.total.toFixed(3)} KD</span>
            )}
          </Button>
        </div>
        <div
          style={{
            float: "right",
            marginRight: 15,
          }}
        >
          {this.props.user && (
            <>
              <span style={{ color: "white" }}>
                Logged in as {localStorage.getItem("username")}
              </span>
              <Button
                type="link"
                style={{ color: "white" }}
                onClick={() => {
                  this.props.logout();
                }}
                title="Logout"
              >
                <LogoutOutlined style={{ fontSize: 22 }} />
              </Button>
            </>
          )}
        </div>
      </Header>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    total: state.admin.total,
    cart: state.admin.cart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutHeader);
