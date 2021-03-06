import { fetchUser, addVehicle, updateDriver } from '../../routines';
import { REGISTRATION_REQUEST, LOGIN_REQUEST } from './actionTypes';

const initialState = {
  user: null,
  driver: null,
  isAuthorized: false,
  loading: true,
  error: null
};

export const profile = (state = initialState, action) => {
  switch (action.type) {
    case REGISTRATION_REQUEST:
    case LOGIN_REQUEST:
    case updateDriver.TRIGGER:
    case addVehicle.TRIGGER:
    case fetchUser.TRIGGER:
      return {
        ...state,
        loading: true
      };
    case fetchUser.SUCCESS: {
      if (!action.payload.driver) {
        return {
          ...state,
          isAuthorized: !!(action.payload && action.payload.user.id),
          user: action.payload.user
        };
      }

      return {
        ...state,
        isAuthorized: !!(action.payload && action.payload.user.id),
        user: action.payload.user,
        driver: action.payload.driver
      };
    }
    case updateDriver.SUCCESS:
      return {
        ...state,
        driver: {
          ...state.driver,
          ...action.payload
        }
      };
    case addVehicle.SUCCESS:
      return {
        ...state,
        driver: {
          ...state.driver,
          vehicles: [...state.driver.vehicles, action.payload]
        }
      };
    case updateDriver.FAILURE:
    case addVehicle.FAILURE:
    case fetchUser.FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case updateDriver.FULFILL:
    case addVehicle.FULFILL:
    case fetchUser.FULFILL:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};
