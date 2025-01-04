import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import FeatherIcons from 'react-native-vector-icons/Feather';
type ApiResponse<BEData> = {
  data: BEData;
  status: 'INITIAL' | 'SUCCCESS' | 'FAIL' | 'LOADING';
  errorMessage: string;
};

type Product = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

const SampleFlatlist = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [apiProducts, setApiProducts] = useState<ApiResponse<Product[]>>({
    data: [],
    status: 'INITIAL',
    errorMessage: '',
  });
  const [isRefreshing, _setIsRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const fetchMoreProducts = () => {
    const newPage = page + 1;
    if (newPage < 5) {
      setPage(newPage);
      fetchProducts(newPage);
    }
  };

  const fetchProducts = async (page = 1) => {
    setApiProducts(prev => ({
      ...prev,
      status: 'LOADING',
    }));
    try {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${page}&limit=10`,
      );
      const data = await response.json();
      setApiProducts({
        data: [...apiProducts.data, ...data],
        status: 'SUCCCESS',
        errorMessage: '',
      });
      if (page === 1) {
        setProducts([...data]);
      } else setProducts([...products, ...data]);
    } catch (errorMessage) {
      setApiProducts({
        data: [],
        status: 'FAIL',
        errorMessage: String(errorMessage),
      });
    }
  };

  return (
    <View
      style={{
        width: responsiveScreenWidth(100),
        height: responsiveScreenHeight(100),
        justifyContent: 'center',
        alignItems: 'center',
        padding: responsiveScreenWidth(15),
      }}>
      {products.length === 0 && (
        <TouchableOpacity
          onPress={() =>
            products.length > 0 ? fetchMoreProducts() : fetchProducts()
          }
          style={{
            backgroundColor: 'red',
            padding: 5,
            width: 120,
            borderRadius: 10,
          }}>
          <Text
            style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>
            {products.length > 0 ? 'Get More Products' : 'Get Products...'}
          </Text>
        </TouchableOpacity>
      )}
      <FlatList
        ListFooterComponent={
          apiProducts.status === 'LOADING' ? <ActivityIndicator /> : null
        }
        refreshing={isRefreshing}
        onRefresh={() => {
          fetchProducts(1);
          setPage(1);
        }}
        data={products}
        keyExtractor={item => item.id}
        onEndReachedThreshold={1}
        onEndReached={fetchMoreProducts}
        maxToRenderPerBatch={10}
        renderItem={({item}) => {
          return (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Image
                source={{uri: item.download_url}}
                style={{width: '100%', height: 200}}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View style={{maxWidth: '50%'}}>
                  <Text>ID: {item.id}</Text>
                  <Text style={{width: '100%'}}>Author: {item.author}</Text>
                  <Text>dn: {`${item.width} X ${item.height}`}</Text>
                </View>
                <View>
                  <FeatherIcons name="download" size={25} />
                  <Text style={{fontWeight: '700'}}>Download</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default SampleFlatlist;
