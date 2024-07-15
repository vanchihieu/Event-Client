import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useState} from 'react';
import {LoginManager, Profile, Settings} from 'react-native-fbsdk-next';
import {useDispatch} from 'react-redux';
import authenticationAPI from '../../../apis/authApi';
import {Facebook, Google} from '../../../assets/svgs';
import {
  ButtonComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../../components';
import {appColors} from '../../../constants/appColors';
import {fontFamilies} from '../../../constants/fontFamilies';
import {LoadingModal} from '../../../modals';
import {addAuth} from '../../../redux/reducers/authReducer';

GoogleSignin.configure({
  webClientId:
    '599149579394-hfd5pr4t338fjo4taaqfgn187b0i228h.apps.googleusercontent.com',
});
// Settings.initializeSDK();
Settings.setAppID('345117821969535');

const SocialLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const api = '/google-signin';
  const dispatch = useDispatch();

  const handleLoginWithGoogle = async () => {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const user = userInfo.user;
      console.log('🚀 ~ handleLoginWithGoogle ~ user:', user);

      const res: any = await authenticationAPI.HandleAuthentication(
        api,
        user,
        'post',
      );

      dispatch(addAuth(res.data));

      await AsyncStorage.setItem('auth', JSON.stringify(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
      ]);

      if (result.isCancelled) {
        console.log('Login cancel');
      } else {
        const profile = await Profile.getCurrentProfile();
        console.log('🚀 ~ handleLoginWithFacebook ~ profile:', profile);

        if (profile) {
          setIsLoading(true);
          const data = {
            name: profile.name,
            givenName: profile.firstName,
            familyName: profile.lastName,
            email: profile.userID,
            photo: profile.imageURL,
          };

          const res: any = await authenticationAPI.HandleAuthentication(
            api,
            data,
            'post',
          );
          console.log('🚀 ~ handleLoginWithFacebook ~ res:', res);

          dispatch(addAuth(res.data));

          await AsyncStorage.setItem('auth', JSON.stringify(res.data));

          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SectionComponent>
      <TextComponent
        styles={{textAlign: 'center'}}
        text="OR"
        color={appColors.gray4}
        size={16}
        font={fontFamilies.medium}
      />
      <SpaceComponent height={16} />

      <ButtonComponent
        type="primary"
        onPress={handleLoginWithGoogle}
        color={appColors.white}
        textColor={appColors.text}
        text="Login with Google"
        textFont={fontFamilies.regular}
        iconFlex="left"
        icon={<Google />}
      />

      <ButtonComponent
        type="primary"
        color={appColors.white}
        textColor={appColors.text}
        text="Login with Facebook"
        textFont={fontFamilies.regular}
        onPress={handleLoginWithFacebook}
        iconFlex="left"
        icon={<Facebook />}
      />
      <LoadingModal visible={isLoading} />
    </SectionComponent>
  );
};

export default SocialLogin;
