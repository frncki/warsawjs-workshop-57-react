import * as React from 'react';
import axios from 'axios';
import { Grid, Container, Loader } from 'semantic-ui-react';

import { useQuery } from 'react-query'

import ChartSwitcher from './ChartSwitcher'
import MealList from './MealList'
import Filters from './Filters'
import { FILTER_OPTIONS } from '../commons/const'
import { countMealsByBedType, prepareChartData, applyFilter } from '../commons/utils';

const RatingChart = React.lazy(() => import("./RatingChart"));

const SelectMeal = (props) => {
  const [isChartVisible, setIsChartVisible] = React.useState(false);

  const { isLoading, data = [], } = useQuery('meals', () => axios('/meals').then(({ data }) => data));

  // const [data, setData] = React.useState([]);
  // const [isLoading, setIsLoading] = React.useState(false);

  const [filters, setFilters] = React.useState({});

  const chartData = React.useMemo(() => prepareChartData(data), [data]);

  const mealsInFilter = React.useMemo(() => countMealsByBedType(data), [data]);
  const filteredData = React.useMemo(() => applyFilter(filters, data), [filters, data]);

  const onFilterChange = React.useCallback((country, checked) => {
    setFilters((state) => {
      return {
        ...state,
        [country]: checked,
      }
    });
  }, [])

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     const result = await axios("/meals");
  //     setIsLoading(false);
  //     setData(result.data);
  //   };
  //   fetchData();
  // }, []);

  return (
    <Layout>
      <Layout.Sidebar>
        <ChartSwitcher isVisible={isChartVisible} onChange={setIsChartVisible} />
        <Filters
          count={mealsInFilter}
          options={FILTER_OPTIONS}
          onChange={onFilterChange}
        />
      </Layout.Sidebar>
      <Layout.Feed>
        <React.Suspense fallback={<Loader active inline="centered" />}>
          {isChartVisible && <RatingChart data={chartData} />}
        </React.Suspense>
        {isLoading ? (
          <Loader active inline="centered" />
        ) : (
          <MealList meals={filteredData} onSelect={{}} />
        )}
      </Layout.Feed>
    </Layout>
  );
};

const Layout = ({ children }) => (
  <Container>
    <Grid stackable divided>
      <Grid.Row>{children}</Grid.Row>
    </Grid>
  </Container>
);

const Sidebar = ({ children }) => (
  <Grid.Column width={4}>{children}</Grid.Column>
);

const Feed = ({ children }) => <Grid.Column width={12}>{children}</Grid.Column>;

Layout.Sidebar = Sidebar;
Layout.Feed = Feed;

export default SelectMeal;
