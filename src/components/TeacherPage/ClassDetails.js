import React, { Component } from "react";
import { connect } from "react-redux";
import instance from "../../store/actions/instance";

// Antd Components
import {
  Modal,
  Select,
  Input,
  Row,
  Col,
  message,
  Button,
  Spin,
  Table,
} from "antd";
import { List, Avatar } from "antd";
import {
  LoadingOutlined,
  UpCircleTwoTone,
  DownCircleTwoTone,
} from "@ant-design/icons";
import moment from "moment";
import NewLesson from "./NewLesson";
// Actions

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { Column } = Table;
const { Option } = Select;

class NewBranchModal extends Component {
  state = {
    students: [],
    lessons: [],
    loading: false,

    orderModalOpen: false,
    selectedOrder: null,
  };

  fetchItems = async () => {
    this.setState({ loading: true });
    try {
      const res = await instance.post("/fetch_lessons_and_students/", {
        class_id: this.props.selectedClass.id,
      });
      console.log(res.data);
      this.setState({ lessons: res.data.lessons, students: res.data.students });
    } catch (err) {
      console.error(err);
    }

    this.setState({ loading: false });
  };

  componentDidMount = () => {
    this.fetchItems();
  };
  render() {
    const { visible, cart } = this.props;
    const {
      students,
      lessons,
      loading,
      selectedOrder,
      orderModalOpen,
      newLessonModalOpen,
    } = this.state;
    // const data = JSON.parse(selectedOrder.items).map((item) => ({
    //   name: item.name,
    //   quantity: item.quantity,
    //   price: item.price,
    //   image: item.image,
    //   description: item.description,
    // }));
    return (
      <Modal
        style={{ top: 20 }}
        destroyOnClose={true}
        title={
          <div
            className="ant-modal-title"
            style={{
              textAlign: "left",
            }}
          >
            Class details
          </div>
        }
        visible={visible}
        onCancel={() => this.props.onClose()}
        cancelText={"Close"}
        bodyStyle={{
          paddingTop: 0,
          width: "auto",
          padding: "0px 18px",
          textAlign: "left",
        }}
        width={"95%"}
        okButtonProps={{
          style: { display: "none" },
        }}
      >
        {newLessonModalOpen && (
          <NewLesson
            visible={newLessonModalOpen}
            class_id={this.props.selectedClass.id}
            onClose={() => {
              this.setState({ newLessonModalOpen: false });
              this.fetchItems();
            }}
          />
        )}
        <div className="px-3 pt-4 pb-2 mb-3">
          <h5 className="mb-3">Class details</h5>
          <div className="mb-3">
            <Button
              type="primary"
              onClick={() => this.setState({ newLessonModalOpen: true })}
            >
              Add Lesson
            </Button>
          </div>
          {!loading ? (
            <Row gutter={[12, 12]}>
              <Col span={12}>
                <p>Students</p>
                <Table
                  scroll={{ x: 400 }}
                  dataSource={students.map((order) => ({
                    key: order.id,
                    obj: order,
                  }))}
                  pagination={false}
                >
                  <Column
                    title={"Name"}
                    key="name"
                    render={(text, record) => <div>{record.obj.name}</div>}
                    onHeaderCell={() => {
                      return {
                        style: { textAlign: "center" },
                      };
                    }}
                    onCell={() => {
                      return {
                        style: { textAlign: "center" },
                      };
                    }}
                  />

                  <Column
                    title={"Remove"}
                    key="remove"
                    render={(text, record) => (
                      <div>
                        <Button danger>Remove</Button>
                      </div>
                    )}
                    onCell={() => {
                      return {
                        style: { textAlign: "center" },
                      };
                    }}
                    onHeaderCell={() => {
                      return {
                        style: { textAlign: "center" },
                      };
                    }}
                  />
                </Table>
              </Col>

              <Col span={12}>
                <p>Lessons</p>
                <Table
                  scroll={{ x: 400 }}
                  dataSource={lessons.map((order) => ({
                    key: order.id,
                    obj: order,
                  }))}
                  pagination={false}
                >
                  <Column
                    title={"Name"}
                    key="name"
                    render={(text, record) => <div>{record.obj.name}</div>}
                    onHeaderCell={() => {
                      return {
                        style: { textAlign: "center" },
                      };
                    }}
                    onCell={() => {
                      return {
                        style: { textAlign: "center" },
                      };
                    }}
                  />

                  <Column
                    title={"Order"}
                    key="order"
                    render={(text, record) => (
                      <div>
                        <UpCircleTwoTone
                          onClick={() => {}}
                          className="mx-1"
                          style={{
                            fontSize: 22,
                          }}
                        />
                        <span className="mx-2">{record.obj.sort_order}</span>
                        <DownCircleTwoTone
                          onClick={() => {}}
                          className="mx-1"
                          style={{
                            fontSize: 22,
                          }}
                        />
                      </div>
                    )}
                    onHeaderCell={() => {
                      return {
                        style: { textAlign: "center" },
                      };
                    }}
                    onCell={() => {
                      return {
                        style: { textAlign: "center" },
                      };
                    }}
                  />
                </Table>
              </Col>
            </Row>
          ) : (
            <div className="my-5 text-center">
              <Spin indicator={antIcon} />
            </div>
          )}
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(NewBranchModal);
