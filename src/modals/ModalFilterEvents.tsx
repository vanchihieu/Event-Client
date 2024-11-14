import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {useSelector} from 'react-redux';
import eventAPI from '../apis/eventApi';
import {
  ButtonComponent,
  ChoiceLocation,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../components';
import {appColors} from '../constants/appColors';
import {Category} from '../models/Category';
import {authSelector} from '../redux/reducers/authReducer';
import {globalStyles} from '../styles/globalStyles';
import {fontFamilies} from '../constants/fontFamilies';
import {ArrowRight, ArrowRight2, Calendar} from 'iconsax-react-native';
import DatePicker from 'react-native-date-picker';
import {DateTime} from '../utils/DateTime';
import {numberToString} from '../utils/numberToString';
import moment from 'moment';
import RnRangeSlider from 'rn-range-slider';

interface Props {
  visible: boolean;
  onClose: () => void;
  onFilter: (val: string) => void;
}

const ModalFilterEvents = (props: Props) => {
  const {visible, onClose, onFilter} = props;

  const [categories, setCategories] = useState<Category[]>([]);

  const [categorySelected, setCategorySelected] = useState<string[]>([]);
  const [isVisibleModalDate, setIsVisibleModalDate] = useState(false);
  const [datetime, setDatetime] = useState<{
    startAt: string;
    endAt: string;
  }>();
  const [timeChoice, settimeChoice] = useState<
    'today' | 'tomorrow' | 'thisWeek'
  >();
  const [postion, setPostion] = useState<{
    lat: number;
    long: number;
  }>();
  const [priceRange, setPriceRange] = useState<{
    low: number;
    high: number;
  }>();

  const modalizeRef = useRef<Modalize>();
  const auth = useSelector(authSelector);
  const timeChoices = [
    {key: 'today', label: 'Today'},
    {
      key: 'tomorrow',
      label: 'Tomorrow',
    },
    {
      key: 'thisWeek',
      label: 'This week',
    },
  ];

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (visible) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [visible]);

  useEffect(() => {
    if (timeChoice === 'today') {
      const d = new Date();

      const date = `${d.getFullYear()}-${numberToString(
        d.getMonth() + 1,
      )}-${numberToString(d.getDate())}`;

      setDatetime({
        startAt: `${date} 00:00:00`,
        endAt: `${date} 23:59:59`,
      });
    } else if (timeChoice === 'tomorrow') {
      const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const date = `${d.getFullYear()}-${numberToString(
        d.getMonth() + 1,
      )}-${numberToString(d.getDate())}`;

      setDatetime({
        startAt: `${date} 00:00:00`,
        endAt: `${date} 23:59:59`,
      });
    } else if (timeChoice === 'thisWeek') {
      const week = moment(new Date()).week();
      const now = moment(new Date()).week(week);

      const start = now.weekday(1).toISOString();
      const end = now.weekday(7).toISOString();

      setDatetime({
        startAt: start,
        endAt: end,
      });
    } else {
    }
  }, [timeChoice]);

  const getCategories = async () => {
    const api = `/get-categories`;

    try {
      const res = await eventAPI.HandleEvent(api);
      setCategories(res.data);
    } catch (error) {
      console.log(`error`, error);
    }
  };

  const handleSelectCategory = (id: string) => {
    const items = [...categorySelected];

    const index = items.findIndex(element => element === id);

    if (items.includes(id)) {
      items.splice(index, 1);
    } else {
      items.push(id);
    }

    setCategorySelected(items);
  };

  const handleValueChange = useCallback((low: number, high: number) => {
    setPriceRange({
      low,
      high,
    });
  }, []);

  const handleFilter = () => {
    onFilter(
      `/get-events?categoryId=${categorySelected.toString()}&${
        datetime ? `startAt=${datetime.startAt}&endAt=${datetime.endAt}` : ''
      }${postion ? `&lat=${postion.lat}&long=${postion.long}&distance=5` : ''}${
        priceRange
          ? `&minPrice=${priceRange.low}&maxPrice=${priceRange.high}`
          : ''
      }`,
    );
    onClose();
  };

  return (
    <>
      <Portal>
        <Modalize
          handlePosition="inside"
          adjustToContentHeight
          ref={modalizeRef}
          onClose={onClose}>
          <SectionComponent styles={{padding: 30}}>
            <TextComponent size={18} text="Filter" />
          </SectionComponent>
          {categories.length > 0 && (
            <FlatList
              style={{marginBottom: 16}}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              renderItem={({item, index}) => (
                <View
                  style={[
                    globalStyles.center,
                    {
                      marginLeft: index === 0 ? 16 : 0,
                      marginRight: index < categories.length - 1 ? 16 : 0,
                    },
                  ]}
                  key={item._id}>
                  <>
                    <TouchableOpacity
                      style={[
                        globalStyles.center,
                        {
                          width: 63,
                          height: 63,
                          backgroundColor: categorySelected.includes(item._id)
                            ? item.color
                            : appColors.white,
                          borderWidth: 1,
                          borderColor: item.color,
                          borderRadius: 100,
                        },
                      ]}
                      onPress={() => handleSelectCategory(item._id)}>
                      <Image
                        source={{
                          uri: categorySelected.includes(item._id)
                            ? item.iconWhite
                            : item.iconColor,
                        }}
                        style={{width: 29, height: 29}}
                      />
                    </TouchableOpacity>
                    <SpaceComponent height={8} />
                    <TextComponent numOfLine={1} text={item.title} />
                  </>
                </View>
              )}
            />
          )}

          <SectionComponent>
            <TextComponent
              text="Date time"
              font={fontFamilies.medium}
              size={16}
            />

            <RowComponent styles={{marginVertical: 12}} justify="flex-start">
              {timeChoices.map((itemChoice: any) => (
                <TouchableOpacity
                  key={itemChoice.key}
                  onPress={() => settimeChoice(itemChoice.key)}
                  style={[
                    globalStyles.button,
                    localStyles.button,
                    {
                      borderColor:
                        timeChoice === itemChoice.key
                          ? appColors.primary
                          : appColors.gray2,
                    },
                  ]}>
                  <TextComponent text={itemChoice.label} />
                </TouchableOpacity>
              ))}
            </RowComponent>
            <RowComponent
              onPress={() => {
                settimeChoice(undefined);
                setIsVisibleModalDate(true);
              }}
              styles={[
                globalStyles.button,
                localStyles.button,
                {
                  paddingVertical: 14,
                  width: '70%',
                },
              ]}>
              <Calendar size={20} color={appColors.primary} variant="Bold" />
              <TextComponent
                text="Choice from calender"
                flex={1}
                styles={{paddingHorizontal: 8}}
              />
              <ArrowRight2 color={appColors.primary} size={20} />
            </RowComponent>
            <TextComponent
              text="Location"
              flex={1}
              size={16}
              font={fontFamilies.medium}
              styles={{paddingHorizontal: 8, marginTop: 16, marginBottom: 12}}
            />
            <ChoiceLocation onSelect={val => setPostion(val.postion)} />

            <RowComponent
              styles={{paddingHorizontal: 8, marginTop: 16, marginBottom: 12}}>
              <TextComponent
                text="Price range"
                flex={1}
                size={16}
                font={fontFamilies.medium}
              />
              <TextComponent
                color={appColors.primary}
                font={fontFamilies.medium}
                text={`$${priceRange?.low} - $${priceRange?.high}`}
              />
            </RowComponent>
            <RowComponent>
              <TextComponent text={'0'} />
              <View style={{flex: 1, paddingHorizontal: 12}}>
                <RnRangeSlider
                  min={0}
                  max={5000}
                  step={10}
                  style={{
                    // flex: 1,
                    height: 5,
                    justifyContent: 'center',
                    // alignItems: 'center',
                    borderRadius: 10,
                    backgroundColor: appColors.gray2,
                  }}
                  renderThumb={() => (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 100,
                        backgroundColor: appColors.primary,
                      }}
                    />
                  )}
                  renderRail={() => null}
                  renderRailSelected={() => null}
                  onValueChanged={handleValueChange}
                />
              </View>
              <TextComponent text={'100'} />
            </RowComponent>
            <SpaceComponent height={16} />
          </SectionComponent>
          <SectionComponent>
            <RowComponent>
              <ButtonComponent
                type="primary"
                color="white"
                onPress={() => {
                  setCategorySelected([]);
                }}
                textColor={appColors.text}
                text="Reset"
              />
              <ButtonComponent
                type="primary"
                onPress={handleFilter}
                text="Agree"
              />
            </RowComponent>
          </SectionComponent>
        </Modalize>
      </Portal>

      <DatePicker
        mode={'date'}
        open={isVisibleModalDate}
        date={new Date()}
        modal
        onCancel={() => setIsVisibleModalDate(false)}
        onConfirm={val => {
          const date = `${val.getFullYear()}-${numberToString(
            val.getMonth() + 1,
          )}-${numberToString(val.getDate())}`;
          setDatetime({
            startAt: `${date} 00:00:00`,
            endAt: `${date} 23:59:59`,
          });

          setIsVisibleModalDate(false);
        }}
      />
    </>
  );
};

export default ModalFilterEvents;

const localStyles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: appColors.gray2,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
  },
});
