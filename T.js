import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const T = ({navigation}) => {
  const [datas, setDatas] = useState([]);
  useEffect(function () {
    const fetch = async () => {
      const res = await axios.get('http://1948ea12a65a.ngrok.io/api/notes');
      setDatas(res.data);
    };
    fetch();
  }, []);

  return (
    <View
      style={{
        justifyContent: 'center',
      }}>
      <Text style={{alignSelf: 'center', fontSize: 30}}>Note App</Text>
      {datas && (
        <FlatList
          style={{padding: 20}}
          data={datas}
          keyExtractor={e => e.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={{
                borderWidth: 2,
                borderRadius: 10,
                backgroundColor: item.color,
                marginBottom: 5,
              }}
              onPress={() => navigation.navigate('show', item)}>
              <Text style={{color: 'white'}}>{item.title} </Text>
            </TouchableOpacity>
          )}
        />
      )}
      <Button title="Create" onPress={() => navigation.navigate('create')} />
    </View>
  );
};
export const Create = ({navigation}) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    color: '',
  });
  const btnAgregarOnPress = async function () {
    try {
      if (form.title.length === 0) {
        alert('Favor de poner titulo');
        return;
      }
      if (form.description.length === 0) {
        alert('Favor de poner description');
        return;
      }
      await axios.post('http://1948ea12a65a.ngrok.io/api/notes', {
        note: {
          title: form.title,
          description: form.description,
          color: form.color,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <Text>Create Note</Text>
      <TextInput
        style={{borderWidth: 3, width: 250}}
        value={form.title}
        onChangeText={e => setForm({...form, title: e})}
      />
      <TextInput
        style={{borderWidth: 3, width: 250}}
        value={form.description}
        onChangeText={e => setForm({...form, description: e})}
      />
      <TextInput
        style={{borderWidth: 3, width: 250}}
        value={form.color}
        onChangeText={e => setForm({...form, color: e})}
      />
      <Button title="Create" onPress={btnAgregarOnPress} />
      <Button title="go back" onPress={() => navigation.navigate('T')} />
    </View>
  );
};

export const Show = ({route: {params}, navigation}) => {
  const [j, setJ] = useState(params.color);
  useEffect(() => {
    async function fetch() {
      await axios.put(`http://1948ea12a65a.ngrok.io/api/notes/${params.id}`, {
        note: {
          title: params.title,
          description: params.description,
          color: j,
        },
      });
    }
    fetch();
  }, [j]);
  async function onEliminarPress() {
    try {
      await axios.delete(`http://1948ea12a65a.ngrok.io/api/notes/${params.id}`);
    } catch (error) {
      console.log(error);
    }
  }
  const colors = ['red', 'blue', 'green', 'yellow'];
  return (
    <View>
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 20,
          width: 400,
          backgroundColor: j,
        }}>
        <Text>{params.id} </Text>
        <Text>{params.title} </Text>
        <Text>{params.description} </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Button
            title="update"
            onPress={() => navigation.navigate('update', params)}
          />
          <Button title="delete" onPress={onEliminarPress} />
        </View>
      </View>
      {colors.map(c => (
        <TouchableOpacity
          onPress={() => setJ(c)}
          key={`${c}`}
          style={{
            backgroundColor: c,
            height: 20,
            width: 20,
            margin: 5,
          }}></TouchableOpacity>
      ))}
      <Button title="go back" onPress={() => navigation.navigate('T')} />
    </View>
  );
};

export const Update = ({route: {params}, navigation}) => {
  const [form, setForm] = useState({
    title: params.title,
    description: params.description,
    color: params.color,
  });
  async function onGuardarPress() {
    try {
      await axios.put(`http://1948ea12a65a.ngrok.io/api/notes/${params.id}`, {
        note: {
          title: form.title,
          description: form.description,
          color: form.color,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View
      style={{
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <TextInput
        style={{borderWidth: 3}}
        value={form.title}
        onChangeText={e => setForm({...form, title: e})}
      />
      <TextInput
        style={{borderWidth: 3}}
        value={form.description}
        onChangeText={e => setForm({...form, description: e})}
      />
      <TextInput
        style={{borderWidth: 3}}
        value={form.color}
        onChangeText={e => setForm({...form, color: e})}
      />
      <Button title="update" onPress={onGuardarPress} />
      <Button title="go back" onPress={() => navigation.navigate('T')} />
    </View>
  );
};
export default T;
