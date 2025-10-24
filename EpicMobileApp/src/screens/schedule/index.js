import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  BackHandler,
  Modal,
  TouchableOpacity,
  FlatList,
  Animated,
  LogBox,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
/**
 * custom imports
 */
import {
  LeftArrow,
  RightArrow,
  SelectedIcon,
  SelectedIconWhite,
} from '../../config/imageConstants';
import styles from './styles';
import {Colors, Mixins, Typography} from '../../config/styles';
import HomeHeaderView from '../../components/common/homeHeaderView';
import NotificationPopupModal from '../../components/common/customNotificationModal';
import ExitComponent from '../../components/common/exitComponent';
import {translate} from '../../translations/translationHelper';
import {Calendar} from '../../components/customLibrary/react-native-calendars';
import {
  getCalendarData,
  getTimeDetails,
  updateSchedulerData,
  updateScheduleData,
  formatMarkedDates,
} from '../../services/scheduler/action';
import {navigateToAlertScreen} from '../../services/alert/action';
import utils from '../../utils';
import ModalView from '../../components/common/modalView';
import {globalStateUpdate} from '../../services/globalState/action';
import {startNotification, stopNotification} from '../../services/home/action';
import {toggleNotificationPopup} from '../../services/notification/action';
import RNExitApp from 'react-native-exit-app';

const {
  findDay,
  isAndroid,
  formatDate,
  formatCurrentDate,
  isEmpty,
  dowObject,
  getDaysOfMonth,
  getYear,
  getMonth,
  tablet,
  showMessageOnToast,
} = utils;
const Schedule = props => {
  const dispatch = useDispatch();
  const {userPermission} = useSelector(state => state.auth);
  const calendarRef = useRef();
  const {
    dayTypes,
    currentDate,
    markedDates,
    focusedMonthData,
    selectedDaysArray,
    calendarData,
  } = useSelector(state => state.scheduler);
  const {stopAllFlag} = useSelector(state => state.globalReducer);

  const {toggleNavigate, safeAlertEventDetail} = useSelector(
    state => state.alert,
  );
  const showNotificationPopup = props.route.params.notificationPermission;
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [leftArrowModalVisible, setLeftArrowModalVisible] = useState(false);
  const [rightArrowModalVisible, setRightArrowModalVisible] = useState(false);
  const [focusedMonth, setFocusedMonth] = useState(
    !!currentDate
      ? formatDate(currentDate, 'MMMM-yyyy')
      : formatCurrentDate('MMMM-yyyy'),
  );

  const [height, setHeight] = useState(Mixins.scaleSize(350));
  const [selectedWeekDays, setSelectedWeekDays] = useState([]);
  const [performAction, setPerformAction] = useState(false);
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    dispatch(toggleNotificationPopup(false));
  }, []);

  const handleBackButtonClick = () => {
    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
      dispatch(updateSchedulerData('selectedDaysArray', []));
      setSelectedWeekDays([]);
    } else {
      setExitModalVisible(true);
    }
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [isAndroid]);

  useEffect(() => {
    dispatch(getTimeDetails(async res => {}));
  }, []);

  useEffect(() => {
    dispatch(
      getCalendarData(async res => {
        checkUserPermission();
      }),
    );
  }, []);

  useEffect(() => {
    return () => {
      dispatch(updateSchedulerData('selectedDaysArray', []));
    };
  }, []);

  useEffect(() => {
    toggleNavigate && props.navigation.navigate('Alerts');
    dispatch(navigateToAlertScreen(false));
  }, [toggleNavigate]);

  const onWeekDayTap = args => {
    if (performAction) {
      let dow = dowObject[args],
        arrayOfDays,
        result = [];
      if (dow) {
        arrayOfDays = getDaysOfMonth(
          getYear(focusedMonthData),
          getMonth(focusedMonthData),
          dow,
        );
        result = arrayOfDays;
      }
      let formattedArray = formatDateArray(result),
        temp = [];
      let weekDayIndex = selectedWeekDays.findIndex(
        element => element === args,
      );
      for (let i of formattedArray) i.dateString && temp.push(i);
      let tempArray = selectedDaysArray;
      if (weekDayIndex === -1) {
        selectedWeekDays.push(args);
        temp.map(element => {
          let index = tempArray.findIndex(
            innerElement => innerElement.dateString === element.dateString,
          );
          if (index === -1) {
            tempArray.push(element);
          }
        });
        dispatch(updateSchedulerData('selectedDaysArray', tempArray));
        setSelectedWeekDays(selectedWeekDays);
      } else {
        selectedWeekDays.splice(weekDayIndex, 1);
        setSelectedWeekDays(selectedWeekDays);
        temp.map(element => {
          let index = tempArray.findIndex(
            inner => inner.dateString === element.dateString,
          );
          if (index > -1) {
            tempArray.splice(index, 1);
          }
        });
        dispatch(updateSchedulerData('selectedDaysArray', tempArray));
      }
    }
  };

  const ondayPress = args => {
    let tempArray = selectedDaysArray;
    let index = tempArray.findIndex(
      element => element.dateString === args.dateString,
    );
    if (index === -1) {
      tempArray.push(args);
    } else {
      tempArray.splice(index, 1);
    }
    dispatch(updateSchedulerData('selectedDaysArray', tempArray));
  };

  const getColor = args => {
    let color;
    if (args === '#ffffff') {
      color = 'black';
    } else if (args && args !== '#ffffff') {
      color = 'white';
    } else {
      color = 'black';
    }
    return color;
  };
  const tabPermission = utils.getTabPermission;
  const checkUserPermission = () => {
    let showScheduleTab;
    let CopySaveSchedulerPermission;
    let filteredArray;
    if (userPermission) {
      filteredArray =
        userPermission?.length > 0 &&
        userPermission.map(item => {
          return {module: item.module_name, Permission: item.permission};
        });
      showScheduleTab = tabPermission(
        filteredArray,
        translate('scheduleModule'),
      );
      CopySaveSchedulerPermission = tabPermission(
        filteredArray,
        translate('copySchedulerModule'),
      );
      if (CopySaveSchedulerPermission) {
        setPerformAction(true);
      }
    }
  };

  const getWeekendColor = args => {
    let color;
    if (args === '#ffffff') {
      color = Colors.COLOR_E53935;
    } else if (args && args !== '#ffffff') {
      color = Colors.COLOR_FFFFFF;
    } else {
      color = Colors.COLOR_E53935;
    }
    return color;
  };

  const renderDayComponent = args => {
    const {date, state, marking} = args;
    const dayType = findDay(date.dateString);
    const isWeekend = dayType === 'Sunday' || dayType === 'Saturday';
    const isSelected =
      selectedDaysArray.findIndex(
        element => element.dateString === date.dateString,
      ) > -1;
    return (
      <TouchableOpacity
        disabled={performAction ? false : true}
        style={[
          styles.dayContainer,
          {
            backgroundColor: markedDates[date.dateString]?.customStyles
              .container.backgroundColor
              ? markedDates[date.dateString]?.customStyles.container
                  .backgroundColor
              : Colors.COLOR_FFFFFF,
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? Colors.COLOR_003D7D : Colors.COLOR_FFFFFF,
          },
        ]}
        activeOpacity={0.7}
        onPress={() => ondayPress(date)}>
        <Text
          style={[
            isWeekend
              ? [
                  styles.weekendStyle(markedDates[date.dateString]),
                  {
                    color: getWeekendColor(
                      markedDates[date.dateString]?.customStyles.container
                        .backgroundColor,
                    ),
                  },
                ]
              : [
                  styles.weekStyle(
                    markedDates[date.dateString] &&
                      markedDates[date.dateString]?.customStyles.container
                        .backgroundColor,
                  ),
                  {
                    color: getColor(
                      markedDates[date.dateString]?.customStyles.container
                        .backgroundColor,
                    ),
                  },
                ],
          ]}>
          {date.day}
        </Text>
        {isSelected &&
          (markedDates[date.dateString]?.customStyles.container
            .backgroundColor === undefined ||
          markedDates[date.dateString]?.customStyles.container
            .backgroundColor === '#ffffff' ? (
            <SelectedIcon
              width={Mixins.scaleSize(12)}
              height={Mixins.scaleSize(12)}
              style={{
                position: 'absolute',
                bottom: tablet ? Mixins.scaleSize(-1) : Mixins.scaleSize(2),
              }}
            />
          ) : (
            <SelectedIconWhite
              width={Mixins.scaleSize(12)}
              height={Mixins.scaleSize(12)}
              style={{
                position: 'absolute',
                bottom: tablet ? Mixins.scaleSize(-1) : Mixins.scaleSize(2),
              }}
            />
          ))}
      </TouchableOpacity>
    );
  };

  const renderCalender = () => {
    return (
      <View onLayout={onLayout} style={[styles.calenderContainer]}>
        <Calendar
          ref={calendarRef}
          current={
            !!currentDate ? currentDate : formatCurrentDate('YYYY-MM-DD')
          }
          markedDates={markedDates}
          markingType={'custom'}
          renderArrow={direction =>
            direction === 'left' ? (
              <LeftArrow
                width={Mixins.scaleSize(14)}
                height={Mixins.scaleSize(14)}
              />
            ) : (
              <RightArrow
                width={Mixins.scaleSize(14)}
                height={Mixins.scaleSize(14)}
              />
            )
          }
          onWeekDayTap={onWeekDayTap}
          dayComponent={args => renderDayComponent(args)}
          onMonthChange={month => {
            dispatch(updateSchedulerData('focusedMonthData', month.dateString));
            setFocusedMonth(formatDate(month.dateString, 'MMMM-yyyy'));
          }}
          hideExtraDays={true}
          renderHeader={date => {
            return (
              <View>
                <Text style={styles.calenderHeaderText}>{focusedMonth}</Text>
              </View>
            );
          }}
          onPressArrowLeft={subtractMonth =>
            isEmpty(selectedDaysArray)
              ? subtractMonth()
              : setLeftArrowModalVisible(true)
          }
          onPressArrowRight={addMonth =>
            isEmpty(selectedDaysArray)
              ? addMonth()
              : setRightArrowModalVisible(true)
          }
          theme={{
            'stylesheet.calendar.main': {
              container: {},
              monthView: {},
              week: {
                flexDirection: 'row',
                justifyContent: 'space-around',
              },
            },
            'stylesheet.calendar.header': {
              header: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: Mixins.scaleSize(6),
              },
              dayHeader: {
                marginBottom: Mixins.scaleSize(6),
                textAlign: 'center',
                fontSize: Mixins.scaleSize(14),
                color: Colors.COLOR_1A1C1C,
                fontFamily: Typography.FONT_FAMILY_BOLD,
                marginRight: Mixins.scaleSize(6),
              },
            },
          }}
        />
      </View>
    );
  };

  const renderdayTypes = rowData => {
    const {name, colorCode, id} = rowData.item;
    return (
      <TouchableOpacity
        disabled={performAction ? false : true}
        style={styles.daysContainer}
        onPress={() => updateScheduleAction(id)}>
        <View style={styles.square(colorCode)}></View>
        <Text style={styles.dayText} numberOfLines={1}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  const getUpperLimit = arg => {
    let monthEdited = getMonth(focusedMonthData),
      upperLimit,
      focusedYear = parseInt(getYear(focusedMonthData));
    if (monthEdited >= 1 && monthEdited <= 7) {
      upperLimit = focusedYear;
    } else if (monthEdited >= 8 && monthEdited <= 12) {
      upperLimit = focusedYear + 1;
    }
    return upperLimit;
  };

  const getLowerLimit = arg => {
    let monthEdited = getMonth(focusedMonthData),
      lowerLimit,
      focusedYear = parseInt(getYear(focusedMonthData));
    if (monthEdited >= 1 && monthEdited <= 7) {
      lowerLimit = focusedYear - 1;
    } else if (monthEdited >= 8 && monthEdited <= 12) {
      lowerLimit = focusedYear;
    }
    return lowerLimit;
  };

  const updateScheduleAction = dayId => {
    if (selectedDaysArray?.length === 0) {
      return;
    }
    const dayArray = selectedDaysArray.map((item, index) => {
      return {
        date: item.dateString,
        dayType: dayId,
      };
    });
    let previousData = calendarData.schdeuleData,
      tempData = previousData.map(element => {
        let moddedElement = {
          date: formatDate(element.bellDate, 'YYYY-MM-DD'),
          dayType: element.dayTypeId,
        };
        return moddedElement;
      });
    dayArray.map(tempElement => {
      let index = tempData.findIndex(ele => ele.date === tempElement.date);
      if (index > -1) {
        tempData[index].dayType = tempElement.dayType;
      } else {
        tempData.push(tempElement);
      }
    });
    let upperLimit = getUpperLimit(focusedMonthData),
      lowerLimit = getLowerLimit(focusedMonthData);

    let filteredData = tempData.filter(tempFilterItem => {
      return (
        moment(tempFilterItem.date).isBetween(
          moment(new Date(`${lowerLimit}-08-01`)),
          moment(new Date(`${upperLimit}-07-31`)),
          'days',
          '[]',
        ) && tempFilterItem
      );
    });

    let payload = {
      scheduleId: '2',
      txtScheduleVal: 'Bells',
      calendarStartMonth: '08',
      calendarStartYear: lowerLimit,
      calendarEndMonth: '07',
      calendarEndYear: upperLimit,
      dayArr: filteredData,
    };
    dispatch(
      updateScheduleData(payload, response => {
        setSelectedWeekDays([]);
        dispatch(updateSchedulerData('selectedDaysArray', []));
        if (response.statusCode === 200) {
          let tempScheduleData = calendarData.schdeuleData;
          dayArray.forEach(element => {
            let index = tempScheduleData.findIndex(innerElement =>
              moment(innerElement.bellDate).isSame(
                moment(`${element.date} 00:00:00`),
              ),
            );
            if (index > -1) {
              let innerIndex = calendarData.daytypes.findIndex(
                temp => temp.id === element.dayType,
              );
              tempScheduleData[index].dayTypeId = element.dayType;
              tempScheduleData[index].dayTypeColorCode =
                calendarData.daytypes[innerIndex].colorCode;
              tempScheduleData[index].dayTypeName =
                calendarData.daytypes[innerIndex].name;
            } else {
              let innerIndex = calendarData.daytypes.findIndex(
                temp => temp.id === element.dayType,
              );
              let tempItem = {
                scheduleId: 2,
                dayTypeId: element.dayType,
                bellDate: `${element.date} 00:00:00`,
                dayTypeColorCode: calendarData.daytypes[innerIndex].colorCode,
              };
              tempScheduleData.push(tempItem);
            }
          });
          let formattedData = formatMarkedDates(tempScheduleData);
          dispatch(updateSchedulerData('markedDates', formattedData));
        }
      }),
    );
  };

  const formatDateArray = datesArray => {
    return datesArray.map((item, index) => {
      return {
        dateString: item,
        day: moment(item).date(),
        month: moment(item).month() + 1,
        timestamp: moment(item).unix(),
        year: moment(item).year(),
      };
    });
  };

  const renderDayList = () => {
    return (
      <View style={styles.listingContainer}>
        <FlatList
          data={dayTypes}
          useNestedScroll={true}
          bounces={false}
          scrollEnabled={true}
          renderItem={renderdayTypes}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  const changeMonthAction = direction => {
    if (direction === 'left') {
      setLeftArrowModalVisible(false);
      calendarRef.current.addMonth(-1);
    } else if (direction === 'right') {
      setRightArrowModalVisible(false);
      calendarRef.current.addMonth(1);
    }
    setSelectedWeekDays([]);
    dispatch(updateSchedulerData('selectedDaysArray', []));
  };

  const renderLeftModal = () => {
    return (
      <Modal
        visible={leftArrowModalVisible}
        transparent={true}
        animationType={'fade'}>
        <ExitComponent
          optionalAction={() => changeMonthAction('left')}
          noAction={() => setLeftArrowModalVisible(false)}
          optionalFlag={true}
        />
      </Modal>
    );
  };

  const renderRightModal = () => {
    return (
      <Modal visible={rightArrowModalVisible} transparent={true}>
        <ExitComponent
          optionalAction={() => changeMonthAction('right')}
          noAction={() => setRightArrowModalVisible(false)}
          optionalFlag={true}
        />
      </Modal>
    );
  };

  const onLayout = event => {
    const {height} = event.nativeEvent.layout;
    setHeight(height);
  };

  const ref = useRef(null);
  const scrollY = useRef(new Animated.Value(0));
  const scrollYClamped = Animated.diffClamp(scrollY.current, 0, height);

  const translateY = scrollYClamped.interpolate({
    inputRange: [0, height],
    outputRange: [0, -(height / 2)],
  });
  const translateYNumber = useRef();
  translateY.addListener(({value}) => {
    translateYNumber.current = value;
  });

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {y: scrollY.current},
        },
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  const getCloser = (value, checkOne, checkTwo) =>
    Math.abs(value - checkOne) < Math.abs(value - checkTwo)
      ? checkOne
      : checkTwo;

  const handleSnap = ({nativeEvent}) => {
    const offsetY = nativeEvent.contentOffset.y;
    if (
      !(
        translateYNumber.current === 0 ||
        translateYNumber.current === -height / 2
      )
    ) {
      if (ref.current) {
        ref.current.scrollToOffset({
          offset:
            getCloser(translateYNumber.current, -height / 2, 0) === -height / 2
              ? offsetY + height / 2
              : offsetY - height / 2,
        });
      }
    }
  };
  const triggerApiCall = () => {
    let innerPayload = {
      event: {
        eventName: 'stopAll',
        freshEvent: true,
        senderInfo: {
          staticServerIP: '127.0.0.1',
        },
      },
    };
    dispatch(startNotification(innerPayload, res => {}));
  };

  const stopAll = () => {
    triggerApiCall();
    dispatch(
      stopNotification(async res => {
        if (res === true) {
          showMessageOnToast({text1: translate('stopAllSuccess')});
        }
      }),
    );
    dispatch(globalStateUpdate('stopAllFlag', false));
  };

  return (
    <View style={styles.container}>
      <HomeHeaderView style={{zIndex: 99}} navigation={props.navigation} />
      <View style={styles.subView}>
        {showNotificationPopup && (
          <NotificationPopupModal navigation={props.navigation} />
        )}
        <ScrollView
          stickyHeaderIndices={[1]}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            width: '100%',
            minHeight: 3 * height + 20,
          }}>
          {renderCalender()}
          <View
            style={{
              backgroundColor: Colors.COLOR_F2F5F9,
              marginTop: Mixins.scaleSize(0),
            }}>
            <View
              style={[
                styles.listingSubContainer,
                {
                  marginStart: Mixins.scaleSize(19),
                  marginEnd: Mixins.scaleSize(16),
                },
              ]}>
              <Text style={styles.dayTypesText}>{translate('dayTypes')}</Text>
              <View style={styles.separatorStyle} />
            </View>
          </View>
          {dayTypes && renderDayList()}
        </ScrollView>
        <Modal visible={exitModalVisible} transparent={true}>
          <ExitComponent
            title={translate('exitConfirmText')}
            yesAction={() => RNExitApp.exitApp()}
            noAction={() => setExitModalVisible(false)}
          />
        </Modal>
        <Modal visible={stopAllFlag} transparent={true}>
          <ModalView
            title={translate('confirmStopAll')}
            firstButtonText={translate('yesStopAll')}
            secondButtonText={translate('noCancel')}
            firstButtonAction={() => {
              stopAll();
            }}
            secondButtonAction={() => {
              dispatch(globalStateUpdate('stopAllFlag', false));
            }}
          />
        </Modal>
        {renderLeftModal()}
        {renderRightModal()}
      </View>
    </View>
  );
};

export default Schedule;
