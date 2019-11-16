import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Icon, Loader, Step } from 'semantic-ui-react';

import CargoParamsForm from '../../components/CargoParamsForm';
import TransportTypeForm from '../../components/TransportTypeForm';
import RoutePointsForm from '../../components/RoutePointsForm';
import ConfirmOrder from '../../components/ConfirmOrder';
import Spinner from '../../components/Spinner';
import { submitOrder } from '../../routines';

import { socketInit } from '../../helpers/socketInitHelper';
import styles from './styles.module.scss';
import { getVehicleTypes } from '../../services/vehicleTypeService';

const orderFormSteps = {
  cargoParams: 0,
  transportType: 1,
  routePoints: 2,
  confirmation: 3
};

const orderProcessSteps = {
  searching: 0,
  inProcess: 1,
  finished: 2
};

class Order extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formStep: orderFormSteps.cargoParams,
      processStep: null,
      /*formStep: null,
      processStep: orderProcessSteps.searching,*/
      volumeWeight: '',
      cargoType: '',
      vehicleTypeId: '',
      vehicleTypes: null,
      fromPoint: undefined,
      toPoint: undefined,
      driverInfo: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.order && !prevProps.order) {
      this.setState({
        formStep: null,
        processStep: orderProcessSteps.searching
      }, this.initSocket);
    }
  }

  initSocket() {
    this.socket = socketInit();
    const { order: { id } } = this.props;

    this.socket.emit('createRoom', id);

    this.socket.on('acceptOrder', driverInfo => {
      this.setState({ isAccepted: true, searchingOrder: false, driverInfo });
    });

    this.socket.on('orderFinished', async () => {
      this.setState({ isAccepted: false, driverInfo: null });
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  goToFormStep = formStep => this.setState({ formStep });

  onFormBack = () => this.setState(({ formStep }) => ({ formStep: formStep - 1 }));

  onFormContinue = values => this.setState(({ formStep }) => ({ formStep: formStep + 1, ...values }));

  onSubmit = () => {
    const {
      volumeWeight,
      cargoType,
      vehicleTypeId,
      fromPoint,
      toPoint
    } = this.state;

    this.props.submitOrder({
      volumeWeight,
      cargoType,
      vehicleTypeId,
      fromPoint,
      toPoint,
      status: 'Pending'
    });

    this.setState({ formStep: null, processStep: orderProcessSteps.searching });
  };

  getFormStepComponent(formStep) {
    const {
      volumeWeight,
      cargoType,
      vehicleTypeId,
      vehicleTypes,
      fromPoint,
      toPoint
    } = this.state;
    const { loading } = this.props;

    switch (formStep) {
      case orderFormSteps.cargoParams:
        return <CargoParamsForm
          volumeWeight={volumeWeight}
          cargoType={cargoType}
          onContinue={this.onFormContinue}
        />;
      case orderFormSteps.transportType:
        if (!vehicleTypes) {
          getVehicleTypes().then(vehicleTypes => this.setState({ vehicleTypes }));

          return <Loader active />;
        }

        return <TransportTypeForm
          vehicleTypeId={vehicleTypeId}
          vehicleTypes={vehicleTypes}
          onBack={this.onFormBack}
          onContinue={this.onFormContinue}
        />;
      case orderFormSteps.routePoints:
        return <RoutePointsForm
          fromPoint={fromPoint}
          toPoint={toPoint}
          onBack={this.onFormBack}
          onContinue={this.onFormContinue}
        />;
      case orderFormSteps.confirmation:
        return <ConfirmOrder
          volumeWeight={volumeWeight}
          cargoType={cargoType}
          transportType={vehicleTypes.find(({ id }) => id === vehicleTypeId).type}
          fromAddress={fromPoint.address}
          toAddress={toPoint.address}
          loading={loading}
          onBack={this.onFormBack}
          onConfirm={this.onSubmit}
        />;
      default:
        return <CargoParamsForm
          volumeWeight={volumeWeight}
          cargoType={cargoType}
          onContinue={this.onFormContinue}
        />;
    }
  }

  getProcessStepComponent = (processStep) => {
    switch (processStep) {
      case orderProcessSteps.searching:
        return (
          <div className={styles.searchingLoaderContainer}>
            <Loader indeterminate active inline="centered">Searching for a driver...</Loader>
          </div>
        );
      case orderProcessSteps.inProcess:
        return 'In Process Component';
      case orderProcessSteps.finished:
        return 'Finished component';
      default:
        return <Spinner text="Searching for a driver..."/>;
    }
  };

  render() {
    const {
      formStep,
      processStep,
      volumeWeight,
      transportType,
    } = this.state;

    const stepComponent = formStep !== null
      ? this.getFormStepComponent(formStep)
      : this.getProcessStepComponent(processStep);

    return (
      <div className={styles.orderContainer}>
        <Header as="h2" attached="top">Your Order</Header>
        {stepComponent}
        {formStep !== null && formStep !== orderFormSteps.confirmation && (
          <Step.Group attached="bottom" size="mini">
            <Step
              link
              active={formStep === orderFormSteps.cargoParams}
              onClick={() => this.goToFormStep(orderFormSteps.cargoParams)}
            >
              <Icon name="boxes" />
              <Step.Content>
                <Step.Title>Cargo info</Step.Title>
                <Step.Description>Enter cargo parameters</Step.Description>
              </Step.Content>
            </Step>

            <Step
              link
              disabled={!volumeWeight}
              active={formStep === orderFormSteps.transportType}
              onClick={() => this.goToFormStep(orderFormSteps.transportType)}
            >
              <Icon name="truck" />
              <Step.Content>
                <Step.Title>Transport</Step.Title>
                <Step.Description>Choose truck type</Step.Description>
              </Step.Content>
            </Step>

            <Step
              link
              disabled={!volumeWeight || !transportType}
              active={formStep === orderFormSteps.routePoints}
              onClick={() => this.goToFormStep(orderFormSteps.routePoints)}
            >
              <Icon name="map marker alternate" />
              <Step.Content>
                <Step.Title>Route points</Step.Title>
                <Step.Description>Select route points</Step.Description>
              </Step.Content>
            </Step>
          </Step.Group>
        )}
      </div>
    );
  }
}

Order.propTypes = {
  order: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  submitOrder: PropTypes.func.isRequired
};

const mapStateToProps = ({ order: { order, loading } }) => ({
  order,
  loading
});

const mapDispatchToProps = {
  submitOrder
};

export default connect(mapStateToProps, mapDispatchToProps)(Order);
