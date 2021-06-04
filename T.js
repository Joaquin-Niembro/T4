import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
const db = SQLite.openDatabase({name: 'myhomework'});
const T = ({navigation}) => {
  const [datas, setDatas] = useState([]);
  useEffect(function () {
    db.transaction(function (t) {
      t.executeSql(
        'CREATE TABLE IF NOT EXISTS notes (' +
          'id    INTEGER         PRIMARY KEY     AUTOINCREMENT,' +
          'title        VARCHAR(128)    NOT NULL,' +
          'description       VARCHAR(128)     NOT NULL,' +
          'color VARCHAR(50) NOT NULL' +
          ');',
        [],
        () => console.log('CREATED TABLE notes'),
        error => console.log({error}),
      );
    });
  }, []);
  useEffect(
    function () {
      navigation.addListener('focus', function () {
        db.transaction(function (t) {
          t.executeSql(
            'SELECT * FROM notes',
            [],
            function (tx, res) {
              let data = [];
              for (let i = 0; i < res.rows.length; i++) {
                data.push(res.rows.item(i));
              }
              setDatas(data);
            },
            error => {
              console.log({error});
            },
          );
        });
      });
    },
    [navigation],
  );
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
  const btnAgregarOnPress = function () {
    if (form.title.length === 0) {
      alert('Favor de poner titulo');
      return;
    }
    if (form.description.length === 0) {
      alert('Favor de poner description');
      return;
    }

    db.transaction(function (t) {
      t.executeSql(
        'INSERT INTO notes (title, description, color) VALUES (?,?,?)',
        [form.title, form.description, form.color],
        function (tx, res) {
          console.log(res);
          navigation.navigate('T');
        },
        error => console.log({error}),
      );
    });
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
    </View>
  );
};

export const Show = ({route: {params}, navigation}) => {
  const [j, setJ] = useState(params.color);
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE notes SET  color = ? WHERE id = ?',
        [j, params.id],
        (tx, result) => {
          if (result.rowsAffected.length === 0) {
            alert('No se actualizaron los datos. Intente de nuevo');
            return;
          }
        },
        error => console.log(error),
      );
    });
  }, [j]);
  function onEliminarPress() {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM notes WHERE id = ?',
        [params.id],
        (tx, res) => {
          if (res.rowsAffected === 0) {
            alert('Fallo al eliminar', 'No se eliminó el registro');
          }

          navigation.navigate('T');
        },
        error => console.log(error),
      );
    });
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
    </View>
  );
};

export const Update = ({route: {params}, navigation}) => {
  const [form, setForm] = useState({
    title: params.title,
    description: params.description,
    color: params.color,
  });
  function onGuardarPress() {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE notes SET title = ?, description = ?, color = ? WHERE id = ?',
        [form.title, form.description, form.color, params.id],
        (tx, result) => {
          if (result.rowsAffected.length === 0) {
            Alert.alert('No se actualizaron los datos. Intente de nuevo');
            return;
          }

          alert('Datos actualizados correctamente');
          navigation.navigate('T');
        },
        error => console.log(error),
      );
    });
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
