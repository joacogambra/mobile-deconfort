import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import commentsAction from "../redux/actions/commentAction";
import axios from "axios";
import apiUrl from "../../url";

export default function Forum() {
  const [open2, setOpen2] = useState(false);
  const { idUser, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let [reload, setReload] = useState(true);
  const { getComment, deleteComment, editComment, createComment } =
    commentsAction;
  let [comments, setComments] = useState([]);
  const [create, setCreate] = useState({
    userId: idUser,
    comment: "",
    photo: "",
    date: new Date(),
  });

  const handleOpen2 = () => {
    open2 ? setOpen2(false) : setOpen2(true);
  };

  useEffect(() => {
    getMyComments();
    // eslint-disable-next-line
  }, [reload]);

  async function getMyComments() {
    let res = await dispatch(getComment());
    setComments(res.payload.comments);
  }

  const handlerInput = (e, campo, value) => {
    setCreate({
      ...create,
      [campo]: e || value,
    });
  };

  const submit = async () => {
    let inputs = Object.values(create).some((input) => input === "");
    let headers = { headers: { Authorization: `Bearer ${token}` } };
    if (!inputs) {
      let data = {
        token: token,
        data: create,
      };
      try {
        let res = await axios.post(`${apiUrl}api/comments`, create, headers);
        console.log(res);
        setReload(!reload);
        if (res.data.success) {
          Alert.alert("Hi", "The comment was created successfully 🤩", [
            {
              text: "OK",
            },
          ]);
        } else {
          Alert.alert("Error", "Your comment could not be posted☹️", [
            {
              text: "OK",
            },
          ]);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      Alert.alert("Error", "All the fields are required! ☹️", [
        {
          text: "OK",
        },
      ]);
    }
  };

  return (
    <View tyle={styles.container}>
      <Image
        style={styles.img}
        source={require("../../assets/ForumBanner.png")}
      ></Image>
      <ScrollView >
      <View>
        <View>
          <View style={styles.containInput}>
            <TextInput
              placeholder="Leave your photo"
              onChangeText={(e) => handlerInput(e, "photo")}
            />
            <TextInput
              placeholder="Leave your comment"
              id="comment"
              style={styles.input}
              color="black"
              onChangeText={(e) => handlerInput(e, "comment")}
            />
          </View>
          <View style={styles.containBtn}>
            <TouchableOpacity style={styles.button}>
              <Text
                style={{ textAlign: "center", color: "black", fontSize: 18 }}
                onPress={submit}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.containComme}>
          {comments?.map((item) => {
            return (
              <View>
                <Text className="dateForum">{item.date}</Text>
                <Image
                  style={styles.image}
                  source={{ uri: item.photo }}
                  alt="Happy"
                />
                <Text className="textForum">{item.comment}</Text>
                <View>
                  <Image
                    style={styles.image}
                    source={{ uri: item?.userId?.photo }}
                    alt=""
                  />
                  <Text className="nameForum">{item?.userId?.name}</Text>
                  {item.userId?._id === idUser ? (
                    <>
                      <View style={styles.containIcon}>
                        <TouchableOpacity
                          onPress={() =>
                            Alert.alert(
                              "Hi",
                              "Are you sure to delete the comment?",
                              [
                                {
                                  text: "OK",
                                  onPress: async () => {
                                    let headers = {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    };
                                    try {
                                      await axios.delete(
                                        `${apiUrl}api/comments/${item._id}`,
                                        headers
                                      );
                                      setReload(!reload);
                                    } catch {}
                                  },
                                },
                                {
                                  text: "Cancel",
                                  style: "cancel",
                                },
                              ]
                            )
                          }
                        >
                          <Image
                            source={require("../../assets/eliminar.png")}
                            style={styles.edit}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity /* onPress={() => navigation.navigate('InputEdit', {commentId: item._id})} */
                        >
                          <Image
                            source={require("../../assets/editar.png")}
                            style={styles.edit}
                          />
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <Text className="buttonForum">Report comment</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    backgroundColor: "white",
  },
  img: {
    marginTop: 30,
    width: "100%",
    height: 70,
    backgroundColor: "white",
  },

  image: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 5,
  },
  edit: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  containInput: {
    width: "100%",
    alignItems: "center",
    padding: 25,
  },
  containComme: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "baseline",
    padding: 50,
  },
});
