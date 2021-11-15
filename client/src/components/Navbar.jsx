import { ReactNode } from "react";
import Logo from "../assets/logo.svg";
import { Link as ReactLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { sendLogoutRequest } from "../store/user";
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Divider,
  Collapse,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Icon,
  Image,
  InputGroup,
  Input,
  InputLeftElement,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FaShoppingCart, FaSearch } from "react-icons/fa";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    axios
      .get("/api/auth/logout")
      .then(({ data }) => {
        dispatch(sendLogoutRequest(data));
        navigate("/home");
      })
      .catch((err) => ({ err: err.message }));
  };

  const subCategories = {
    cellphones_by_brand: ["Samsung", "LG", "Motorola", "Apple"],
    consoles_and_videogames: [
      "consoles",
      "games",
      "accesories",
      "Xbox Series X",
    ],
    gaming_PC: ["mouses", "keyboards", "pads"],
    informatics: [
      "notebooks",
      "tablets",
      "monitors",
      "printers",
      "cartridges",
      "all in one and desktop PC",
    ],
    computer_accessories: [
      "connectivity",
      "webcam",
      "speakers",
      "stabilizers",
      "backpacks and notebook bags",
    ],
  };

  const user = useSelector((state) => state.user);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"}>
          <Link as={ReactLink} to="/home">
            <Box boxSize={10}>
              <Image src={Logo} alt="Segun Adebayo" />
            </Box>
          </Link>
          <InputGroup ml="10" w="35%">
            <InputLeftElement
              pointerEvents="none"
              children={<FaSearch color="gray.300" />}
            />
            <Input
              bg={useColorModeValue("gray.50", "gray.700")}
              type="tel"
              placeholder="Search some products!"
            />
          </InputGroup>

          <Flex alignItems={"center"} ml="auto">
            <Stack direction={"row"} spacing={7} alignItems={"center"}>
              <Button onClick={toggleColorMode} bg="none" rounded="full">
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Link
                as={ReactLink}
                to={user.username ? `/${user.username}/myCart` : `cart`}
              >
                <Icon as={FaShoppingCart} />
              </Link>
              <Menu>
                {user.email ? (
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </MenuButton>
                ) : (
                  <Link as={ReactLink} to="/login">
                    <Button>Sign In</Button>
                  </Link>
                )}
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={"https://avatars.dicebear.com/api/male/username.svg"}
                    />
                  </Center>
                  <br />
                  {user.username ? (
                    <Center>
                      <p>{user.username}</p>
                    </Center>
                  ) : null}
                  <br />
                  <MenuDivider />
                  {user.isAdmin ? <Link as={ReactLink} to="/admin"><MenuItem>Admin</MenuItem></Link> : null}
                  <MenuItem>
                    <Link as={ReactLink} to="/profile">
                      Your Profile
                    </Link>
                  </MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
        <Divider orientation="horizontal" />
        <Center>
          {Object.keys(subCategories).map((category, i) => (
            <Popover trigger={"hover"} key={i}>
              <PopoverTrigger bg="none" on>
                <Button bg="none">{category.split("_").join(" ")}</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Stack align={"center"}>
                  {subCategories[category].map((sub, i) => (
                    <Link
                      as={ReactLink}
                      to={`/categories/${category}/${sub.split(" ").join("_")}`}
                      style={{ textDecoration: "none" }}
                      key={i}
                    >
                      {sub}
                    </Link>
                  ))}
                </Stack>
              </PopoverContent>
            </Popover>
          ))}
        </Center>
      </Box>
    </>
  );
}
