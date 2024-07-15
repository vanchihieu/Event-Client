import {Lock, Sms, User} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import {LoadingModal} from '../../modals';
import {Validate} from '../../utils/validate';
import SocialLogin from './components/SocialLogin';
import authenticationAPI from '../../apis/authApi';
import {addAuth} from '../../redux/reducers/authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

interface ErrorMessages {
  email: string;
  password: string;
  confirmPassword: string;
}

const initValue = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignUpScreen = ({navigation}: any) => {
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>({});
  const [isDisable, setIsDisable] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const hasError = Object.values(errorMessage).some(Boolean);
    const hasEmptyValues =
      !values.email || !values.password || !values.confirmPassword;
    setIsDisable(hasError || hasEmptyValues);
  }, [errorMessage, values]);

  const handleChangeValue = (key: string, value: string) => {
    setValues(prevValues => ({...prevValues, [key]: value}));
  };

  const formValidator = (key: string) => {
    const data = {...errorMessage};
    let message = '';

    switch (key) {
      case 'email':
        message = !values.email
          ? 'Email is required!!!'
          : !Validate.email(values.email)
          ? 'Email is not invalid!!'
          : '';
        break;

      case 'password':
        message = !values.password ? 'Password is required!!!' : '';
        break;

      case 'confirmPassword':
        message = !values.confirmPassword
          ? 'Please type confirm password!!'
          : values.confirmPassword !== values.password
          ? 'Password is not match!!!'
          : '';
        break;
    }

    data[`${key}`] = message;

    setErrorMessage(data);
  };

  const handleRegister = async () => {
    const api = '/verification';
    setIsLoading(true);
    try {
      const res = await authenticationAPI.HandleAuthentication(
        api,
        {email: values.email},
        'post',
      );
      console.log('🚀 ~ handleRegister ~ res:', res);

      setIsLoading(false);

      navigation.navigate('Verification', {
        code: res.data.code,
        ...values,
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      //   Alert.alert('Email is already exist!!!');
    }
  };

  return (
    <>
      <ContainerComponent isImageBackground isScroll back>
        <SectionComponent>
          <TextComponent size={24} title text="Sign up" />
          <SpaceComponent height={21} />
          <InputComponent
            value={values.username}
            placeholder="Full name"
            onChange={val => handleChangeValue('username', val)}
            allowClear
            affix={<User size={22} color={appColors.gray} />}
          />
          <InputComponent
            value={values.email}
            placeholder="abc@email.com"
            onChange={val => handleChangeValue('email', val)}
            allowClear
            affix={<Sms size={22} color={appColors.gray} />}
            onEnd={() => formValidator('email')}
          />
          <InputComponent
            value={values.password}
            placeholder="Password"
            onChange={val => handleChangeValue('password', val)}
            isPassword
            allowClear
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('password')}
          />
          <InputComponent
            value={values.confirmPassword}
            placeholder="Confirm password"
            onChange={val => handleChangeValue('confirmPassword', val)}
            isPassword
            allowClear
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('confirmPassword')}
          />
        </SectionComponent>

        {errorMessage && (
          <SectionComponent>
            {Object.keys(errorMessage).map(
              (error, index) =>
                errorMessage[`${error}`] && (
                  <TextComponent
                    text={errorMessage[`${error}`]}
                    key={`error${index}`}
                    color={appColors.danger}
                  />
                ),
            )}
          </SectionComponent>
        )}
        <SpaceComponent height={16} />
        <SectionComponent>
          <ButtonComponent
            onPress={handleRegister}
            text="SIGN UP"
            disable={isDisable}
            type="primary"
          />
        </SectionComponent>
        <SocialLogin />
        <SectionComponent>
          <RowComponent justify="center">
            <TextComponent text="Don’t have an account? " />
            <ButtonComponent
              type="link"
              text="Sign in"
              onPress={() => navigation.navigate('LoginScreen')}
            />
          </RowComponent>
        </SectionComponent>
      </ContainerComponent>
      <LoadingModal visible={isLoading} />
    </>
  );
};

export default SignUpScreen;
