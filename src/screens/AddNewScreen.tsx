import {Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  ButtonComponent,
  ButtonImagePicker,
  ChoiceLocation,
  ContainerComponent,
  DateTimePicker,
  DropdownPicker,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import {useSelector} from 'react-redux';
import {authSelector} from '../redux/reducers/authReducer';
import userAPI from '../apis/userApi';
import {SelectModel} from '../models/SelectModel';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {Validate} from '../utils/validate';
import {appColors} from '../constants/appColors';
import storage from '@react-native-firebase/storage';
import {EventModel} from '../models/EventModel';
import eventAPI from '../apis/eventApi';
import {DateTime} from '../utils/DateTime';

const initValues = {
  title: '',
  description: '',
  locationTitle: '',
  locationAddress: '',
  position: {
    lat: '',
    long: '',
  },
  photoUrl: '',
  users: [],
  authorId: '',
  startAt: Date.now(),
  endAt: Date.now(),
  date: Date.now(),
  price: '',
  categories: '',
};

const AddNewScreen = ({navigation}: any) => {
  const auth = useSelector(authSelector);

  const [eventData, setEventData] = useState<any>({
    ...initValues,
    authorId: auth.id,
  });

  const [usersSelects, setUsersSelects] = useState<SelectModel[]>([]);
  const [fileSelected, setFileSelected] = useState<any>();
  const [errorsMess, setErrorsMess] = useState<string[]>([]);
  const [categories, setCategories] = useState<SelectModel[]>([]);

  useEffect(() => {
    const mess = Validate.EventValidation(eventData);

    setErrorsMess(mess);
  }, [eventData]);

  const getCategories = async () => {
    const api = `/get-categories`;

    try {
      const res = await eventAPI.HandleEvent(api);
      if (res.data) {
        const items: SelectModel[] = [];

        const data = res.data;

        data.forEach((item: any) =>
          items.push({
            label: item.title,
            value: item._id,
          }),
        );

        setCategories(items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeValue = (
    key: string,
    value: string | number | string[],
  ) => {
    const items = {...eventData};

    items[`${key}`] = value;

    setEventData(items);
  };

  const handleGetAllUsers = async () => {
    const api = '/get-all';

    try {
      const res: any = await userAPI.HandleUser(api);

      if (res && res.data) {
        const items: SelectModel[] = [];

        res.data.forEach(
          (item: any) =>
            item.email &&
            items.push({
              label: item.email,
              value: item.id,
            }),
        );

        setUsersSelects(items);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddEvent = async () => {
    if (fileSelected) {
      const filename = `${fileSelected.filename ?? `image-${Date.now()}`}.${
        fileSelected.path.split('.')[1]
      }`;
      const path = `images/${filename}`;

      const res = storage().ref(path).putFile(fileSelected.path);

      res.on(
        'state_changed',
        (snap: {bytesTransferred: any}) => {
          console.log(snap.bytesTransferred);
        },
        (error: any) => {
          console.log(error);
        },
        () => {
          storage()
            .ref(path)
            .getDownloadURL()
            .then((url: any) => {
              eventData.photoUrl = url;

              handlePustEvent(eventData);
            });
        },
      );
    } else {
      handlePustEvent(eventData);
    }
  };

  const handlePustEvent = async (event: EventModel) => {
    const api = '/add-new';
    try {
      event.startAt = DateTime.GetEventTime(event.date, event.startAt);
      event.endAt = DateTime.GetEventTime(event.date, event.endAt);

      const res = await eventAPI.HandleEvent(api, event, 'post');

      navigation.navigate('Explore', {
        screen: 'HomeScreen',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileSelected = (val: ImageOrVideo) => {
    setFileSelected(val);
    handleChangeValue('photoUrl', val.path);
  };

  const handleLocation = (val: any) => {
    const items = {...eventData};
    items.position = val.postion;
    items.locationAddress = val.address;

    setEventData(items);
  };

  useEffect(() => {
    handleGetAllUsers();
    getCategories();
  }, []);

  return (
    <ContainerComponent isScroll>
      <SectionComponent>
        <TextComponent text="Add new" title />
      </SectionComponent>
      <SectionComponent>
        {eventData.photoUrl || fileSelected ? (
          <Image
            source={{
              uri: eventData.photoUrl ? eventData.photoUrl : fileSelected.uri,
            }}
            style={{width: '100%', height: 250, marginBottom: 12}}
            resizeMode="cover"
          />
        ) : (
          <></>
        )}
        <ButtonImagePicker
          onSelect={(val: any) =>
            val.type === 'url'
              ? handleChangeValue('photoUrl', val.value as string)
              : handleFileSelected(val.value)
          }
        />
        <InputComponent
          placeholder="Title"
          value={eventData.title}
          allowClear
          onChange={val => handleChangeValue('title', val)}
        />
        <InputComponent
          placeholder="Description"
          multiline
          numberOfLine={3}
          allowClear
          value={eventData.description}
          onChange={val => handleChangeValue('description', val)}
        />

        <DropdownPicker
          selected={eventData.categories}
          values={categories}
          onSelect={val => handleChangeValue('categories', val)}
        />

        <RowComponent>
          <DateTimePicker
            label="Start at: "
            type="time"
            onSelect={val => handleChangeValue('startAt', val)}
            selected={eventData.startAt}
          />
          <SpaceComponent width={20} />
          <DateTimePicker
            label="End at:"
            type="time"
            onSelect={val => handleChangeValue('endAt', val)}
            selected={eventData.endAt}
          />
        </RowComponent>

        <DateTimePicker
          label="Date:"
          type="date"
          onSelect={val => handleChangeValue('date', val)}
          selected={eventData.date}
        />

        <DropdownPicker
          label="Invited users"
          values={usersSelects}
          onSelect={(val: string | string[]) =>
            handleChangeValue('users', val as string[])
          }
          selected={eventData.users}
          multible
        />
        <InputComponent
          placeholder="Title Address"
          allowClear
          value={eventData.locationTitle}
          onChange={val => handleChangeValue('locationTitle', val)}
        />
        <ChoiceLocation onSelect={val => handleLocation(val)} />
        <InputComponent
          placeholder="Price"
          allowClear
          type="number-pad"
          value={eventData.price}
          onChange={val => handleChangeValue('price', val)}
        />
      </SectionComponent>

      {errorsMess.length > 0 && (
        <SectionComponent>
          {errorsMess.map(mess => (
            <TextComponent
              text={mess}
              key={mess}
              color={appColors.danger}
              styles={{marginBottom: 12}}
            />
          ))}
        </SectionComponent>
      )}

      <SectionComponent>
        <ButtonComponent
          disable={errorsMess.length > 0}
          text="Add New"
          onPress={handleAddEvent}
          type="primary"
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default AddNewScreen;
