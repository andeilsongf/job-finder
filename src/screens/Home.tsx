import {
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  StatusBar,
  Text,
  useTheme,
  VStack,
  FlatList,
  Center,
} from "native-base";

import * as Location from "expo-location";
import auth from "@react-native-firebase/auth";

import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import { Category } from "../components/Category";
import { Job, JobProps } from "../components/Job";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

export function Home() {
  const { colors } = useTheme();

  const navigation = useNavigation();

  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Wait, we are fetching you location..."
  );

  function handleLogout() {
    auth()
      .signOut()
      .catch((error) => {
        console.log(error);
        return Alert.alert(
          "Logout",
          "It was not possible to sign out. Try again."
        );
      });
  }

  function registerJob() {
    navigation.navigate("register");
  }

  const [jobs, setJobs] = useState<JobProps[]>([
    {
      id: "1",
      title: "Twitch",
      company: "Pinion",
      type: "Full Time",
    },
    {
      id: "2",
      title: "YouTube",
      company: "Pinion",
      type: "Remote",
    },
    {
      id: "3",
      title: "Apple",
      company: "Pinion",
      type: "Full Time",
    },
    {
      id: "4",
      title: "Google",
      company: "Pinion",
      type: "Remote",
    },
  ]);

  useEffect(() => {
    GetCurrentLocation();
  }, []);

  const GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Location",
        "Allow us to use your location for better service?",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync({});

    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        let address = `${item.city}, ${item.country}`;

        setDisplayCurrentAddress(address);
      }
    }
  };

  return (
    <VStack bg="gray.300" flex={1}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <HStack
        h="120"
        bg="primary.100"
        roundedBottomLeft="30"
        roundedBottomRight="30"
        alignItems="center"
        justifyContent="space-between"
        px="14"
        pt={10}
      >
        <Button
          variant="outline"
          borderWidth={0}
          p={0}
          leftIcon={
            <Icon
              size={8}
              color="white"
              as={<Feather name="log-out" size={24} color="white" />}
            />
          }
          _pressed={{
            bg: "transparent",
          }}
          onPress={handleLogout}
        />

        <VStack
          alignItems="center"
          alignContent="center"
          justifyContent="center"
        >
          <HStack space="1">
            <Text
              color="green.300"
              fontSize="xs"
              fontWeight={500}
              letterSpacing="xs"
            >
              Current location
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={20}
              color={colors.green[300]}
            />
          </HStack>
          <VStack>
            <Text color="white" fontWeight={500} letterSpacing="xs">
              {displayCurrentAddress}
            </Text>
          </VStack>
        </VStack>

        <Button
          bg="transparent"
          _pressed={{
            bg: "transparent",
          }}
          leftIcon={
            <Icon
              size={8}
              as={
                <MaterialCommunityIcons
                  name="pencil-plus-outline"
                  size={40}
                  color="white"
                />
              }
            />
          }
          onPress={registerJob}
        />
      </HStack>

      <VStack>
        <Text></Text>
      </VStack>

      <VStack p={5} mt="34">
        <HStack w="full" space="2">
          <Input
            placeholder="Search job or positions ..."
            borderWidth={0}
            w="315"
            bg="white"
            h="50"
            _focus={{
              bg: "white",
              borderWidth: 1,
              borderColor: "gray.100",
            }}
            fontSize="sm"
            fontWeight={400}
            leftElement={
              <Icon
                size={6}
                as={<Feather name="search" color="gray.200" />}
                ml={4}
              />
            }
          />
          <Button
            bg="green.300"
            w="50"
            h="50"
            _pressed={{
              bg: "green.200",
            }}
            leftIcon={
              <Icon
                size={8}
                as={<Feather name="align-center" size={30} color="white" />}
              />
            }
          />
        </HStack>
        <HStack mt="34" justifyContent="space-between" alignItems="center">
          <Heading
            fontWeight={500}
            fontSize="lg"
            letterSpacing="sm"
            color="primary.100"
          >
            Job Category
          </Heading>
        </HStack>

        <HStack mt="22" w="full" space={3}>
          <Category flexGrow={1} title="Remote" quantity="230" />
          <Category flexGrow={1} title="Presential" quantity="1030" />
        </HStack>

        <HStack
          mt="34"
          mb={6}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading
            fontWeight={500}
            fontSize="lg"
            letterSpacing="sm"
            color="primary.100"
          >
            Recent Jobs
          </Heading>
          <Text
            fontWeight={500}
            fontSize="xs"
            letterSpacing="xs"
            color="green.200"
          >
            Show All
          </Text>
        </HStack>

        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Job data={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 500,
          }}
          ListEmptyComponent={() => (
            <Center pt={20}>
              <HStack alignItems="center" space={3}>
                <Ionicons
                  name="ios-alert-circle-outline"
                  size={24}
                  color={colors.gray[200]}
                />
                <Text fontWeight={400} fontSize="2xl" color="gray.200">
                  No jobs registered.
                </Text>
              </HStack>
            </Center>
          )}
        />
      </VStack>
    </VStack>
  );
}