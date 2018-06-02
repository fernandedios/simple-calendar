import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router';
import ReactTestRenderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';

import App from '../app/App';
import Header from '../app/Header';
import Login from '../forms/Login';
import Signup from '../forms/Signup';

const mockStore = configureStore();
const initialState = {};
let store;

beforeEach(() => {
  store = mockStore(initialState);
});

describe('<App />', () => {
  it('renders without crashing', () => {
    shallow(<App />);
  });
});

describe('<Header />', () => {
  it('renders the header', () => {
    const output = mount(
      <MemoryRouter>
        <Header store={store} />
      </MemoryRouter>
    );
    expect(output.find('nav.navbar').length).toEqual(1);
  });

  it('should render correctly', () => {
    const output = ReactTestRenderer.create(
    <MemoryRouter>
      <Header store={store} />
    </MemoryRouter>).toJSON();
    expect(output).toMatchSnapshot();
  });
});

describe('<Login />', () => {
  it('renders the login form', () => {
    const output = mount(
        <Login store={store} />
    );
    expect(output.find('form').length).toEqual(1);
  });

  it('should render correctly', () => {
    const output = ReactTestRenderer.create(<Login store={store} />).toJSON();
    expect(output).toMatchSnapshot();
  });
});

describe('<Signup />', () => {
  it('renders the Signup form', () => {
    const output = mount(
        <Signup store={store} />
    );
    expect(output.find('form').length).toEqual(1);
  });

  it('should render correctly', () => {
    const output = ReactTestRenderer.create(<Signup store={store} />).toJSON();
    expect(output).toMatchSnapshot();
  });
});

