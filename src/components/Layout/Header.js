import React, { Component } from "react";
import { Layout, Button } from "antd";
import { connect } from "react-redux";
import { LogoutOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { logout } from "../../store/actions/auth";
import { Select } from "antd";
const { Header } = Layout;

class LayoutHeader extends Component {
  state = {};
  render() {
    const { t, s } = this.props;

    return (
      <Header
        className="site-layout-background"
        style={{ padding: 0, backgroundColor: "#0099cc" }}
      >
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutHeader);
