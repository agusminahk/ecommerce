import Carousel from '../components/Carousel';
import ProductsGrid from '../components/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProducts } from '../store/product';
import { useEffect, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import {
    Button,
    Text,
    Box,
    Link,
    Image,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from '@chakra-ui/react';
import axios from 'axios';

const Home = () => {
    const { products } = useSelector((s) => s.product);
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const user = useSelector((state) => state.user);
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        const jsonCart = localStorage.getItem('carrito');
        let localCart = JSON.parse(jsonCart);
        if (localCart?.list?.length > 0) setIsOpen(true);
        dispatch(getAllProducts());
        window.addEventListener('scroll', handleScroll, { passive: true });
    }, []);

    useEffect(() => {
        const jsonCart = localStorage.getItem('carrito');
        let localCart = JSON.parse(jsonCart);
        if (localCart?.list?.length > 0) setIsOpen(true);
        dispatch(getAllProducts());
    }, [dispatch]);

    const mergeCart = () => {
        const jsonCart = localStorage.getItem('carrito');
        let { list } = JSON.parse(jsonCart);
        let localCart = [];
        list.map((cartItem) => {
            localCart.push({
                productId: cartItem.product._id,
                quantity: cartItem.quantity,
            });
        });

        axios
            .get(`/api/cart/${user._id}`)
            .then((res) => res.data)
            .then((dbCart) => {
                if (dbCart !== null) {
                    dbCart = dbCart.products;

                    localCart.map((localItem) => {
                        let alreadyIn = false;
                        dbCart.map((dbItem) => {
                            if (dbItem.productId === localItem.productId) {
                                dbItem.quantity += localItem.quantity;
                                alreadyIn = true;
                            }
                        });
                        if (!alreadyIn) dbCart.push({ ...localItem });
                    });

                    axios.put(`/api/cart/${user._id}`, { products: dbCart });
                } else
                    axios.post(`http://localhost:8080/api/cart/`, {
                        products: localCart,
                        userId: user._id,
                    });

                localStorage.setItem('carrito', null);

                setIsOpen(false);
            });
    };

    return (
        <>
            <AlertDialog isOpen={isOpen && user.username}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            There are products left in the local cart!
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Do you want to move the products to your personal cart?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={() => setIsOpen(false)}>
                                <Text overflow="hidden">No, leave my cart as it is</Text>
                            </Button>
                            <Button colorScheme="green" onClick={() => mergeCart()} ml={3}>
                                <Text overflow="hidden">Yes, please move them to my cart</Text>
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            {scrollPosition > 500 && (
                <Link href="#top">
                    <Box
                        position="fixed"
                        bottom="20px"
                        right={['16px', '20px']}
                        zIndex={1}
                        h="10%"
                        w="5%"
                        bg="green.300"
                        rounded="full"
                        align="center"
                        justify="center"
                        fontSize="30"
                    >
                        <IoIosArrowUp />
                    </Box>
                </Link>
            )}
            <Carousel slides={products} />
            <ProductsGrid />
        </>
    );
};

export default Home;
