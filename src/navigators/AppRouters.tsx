import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addAuth, authSelector} from '../redux/reducers/authReducer';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import {SplashScreen} from '../screens';
import {UserHandle} from '../utils/UserHandlers';

const AppRouters = () => {
  const [isShowSplash, setIsShowSplash] = useState(true);

  const {getItem} = useAsyncStorage('auth');

  const auth = useSelector(authSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    handleGetDatas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (auth.id) {
      UserHandle.getFollowersById(auth.id, dispatch);
      UserHandle.getFollowingByUid(auth.id, dispatch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.id]);

  const handleGetDatas = async () => {
    await checkLogin();

    setIsShowSplash(false);
  };

  const checkLogin = async () => {
    const res = await getItem();

    res && dispatch(addAuth(JSON.parse(res)));
  };

  return (
    <>
      {isShowSplash ? (
        <SplashScreen />
      ) : auth.accesstoken ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default AppRouters;
