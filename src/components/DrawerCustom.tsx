import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';
import {AvatarComponent, RowComponent, SpaceComponent, TextComponent} from '.';
import {globalStyles} from '../styles/globalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector, removeAuth} from '../redux/reducers/authReducer';
import {appColors} from '../constants/appColors';
import {
  Bookmark2,
  Calendar,
  Logout,
  Message2,
  MessageQuestion,
  Setting2,
  Sms,
  User,
} from 'iconsax-react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager} from 'react-native-fbsdk-next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrawerCustom = ({navigation}: any) => {
  const user = useSelector(authSelector);
  const auth = useSelector(authSelector);
  console.log('🚀 ~ DrawerCustom ~ auth:', auth);

  const dispatch = useDispatch();
  const size = 20;
  const color = appColors.gray;
  const profileMenu = [
    {
      key: 'MyProfile',
      title: 'My Profile',
      icon: <User size={size} color={color} />,
    },
    {
      key: 'Message',
      title: 'Message',
      icon: <Message2 size={size} color={color} />,
    },
    {
      key: 'Calendar',
      title: 'Calendar',
      icon: <Calendar size={size} color={color} />,
    },
    {
      key: 'Bookmark',
      title: 'Bookmark',
      icon: <Bookmark2 size={size} color={color} />,
    },
    {
      key: 'ContactUs',
      title: 'Contact Us',
      icon: <Sms size={size} color={color} />,
    },
    {
      key: 'Settings',
      title: 'Settings',
      icon: <Setting2 size={size} color={color} />,
    },
    {
      key: 'HelpAndFAQs',
      title: 'Help & FAQs',
      icon: <MessageQuestion size={size} color={color} />,
    },
    {
      key: 'SignOut',
      title: 'Sign Out',
      icon: <Logout size={size} color={color} />,
    },
  ];

  const handleLogout = async () => {
    await GoogleSignin.signOut();
    LoginManager.logOut();
    dispatch(removeAuth({}));
    await AsyncStorage.clear();
  };

  const handleNavigation = (key: string) => {
    switch (key) {
      case 'SignOut':
        handleLogout();
        break;

      case 'MyProfile':
        navigation.navigate('Profile', {
          screen: 'ProfileScreen',
          params: {
            id: auth.id,
          },
        });
        break;
      default:
        console.log(key);
        break;
    }

    navigation.closeDrawer();
  };

  const displayName = user.name || user.email;
  const lastInitial = displayName ? displayName.split(' ').pop().charAt(0) : ''; // lấy chữ cái cuối cùng của tên
  const displayText =
    user.name ||
    user.email.substring(0, user.email.indexOf('@')).substring(0, 10);

  return (
    <View style={[localStyles.container]}>
      {/* <TouchableOpacity
        onPress={() => {
          navigation.closeDrawer();

          navigation.navigate('Profile', {
            screen: 'ProfileScreen',
          });
        }}>
        {user.photo ? (
          <Image source={{uri: user.photo}} style={[localStyles.avatar]} />
        ) : (
          <View
            style={[localStyles.avatar, {backgroundColor: appColors.gray2}]}>
            <TextComponent
              title
              size={22}
              color={appColors.white}
              text={lastInitial}
            />
          </View>
        )}
        <TextComponent text={displayText} title size={18} />
      </TouchableOpacity> */}
      <AvatarComponent
        onPress={() => handleNavigation('MyProfile')}
        photoURL={auth.photo}
        name={auth.name ? auth.name : auth.email}
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={profileMenu}
        style={{flex: 1, marginVertical: 20}}
        renderItem={({item, index}) => (
          <RowComponent
            styles={[localStyles.listItem]}
            onPress={() => handleNavigation(item.key)}>
            {item.icon}
            <TextComponent
              text={item.title}
              styles={localStyles.listItemText}
            />
          </RowComponent>
        )}
      />

      <RowComponent justify="flex-start">
        <TouchableOpacity
          style={[
            globalStyles.button,
            {backgroundColor: '#00F8FF33', height: 'auto'},
          ]}>
          <MaterialCommunityIcons name="crown" size={24} color={'#00F8FF'} />
          <SpaceComponent width={8} />
          <TextComponent color="#097b7b" text="Upgrade Pro" size={16} />
        </TouchableOpacity>
      </RowComponent>
    </View>
  );
};

export default DrawerCustom;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: Platform.OS === 'android' ? StatusBar.currentHeight : 48,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 100,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    paddingVertical: 12,
    justifyContent: 'flex-start',
  },

  listItemText: {
    paddingLeft: 12,
  },
});
