import { useState, useMemo } from 'react';
import './Filter.css';
import { useGetazmiuQuery } from '../../Services/Api/azmiu';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);
interface Product {
    _id: string;
    name: string;
    price: number;
}

interface OrderItem {
    product: Product[];
    amount: number;
    date: string;
}

const Filter = () => {
    const { data: products = [] as OrderItem[] } = useGetazmiuQuery(undefined);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [orderAmount, setOrderAmount] = useState<string>('');
    const [orderDate, setOrderDate] = useState<string>('');

    const filteredProducts = useMemo(() => {
        return products.filter((item: OrderItem) => {
            const matchesProductName = item.product.some((product: Product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const matchesOrderAmount = orderAmount ? item.amount === Number(orderAmount) : true;
            const matchesOrderDate = orderDate ? new Date(item.date).toISOString().split('T')[0] === orderDate : true;

            return matchesProductName && matchesOrderAmount && matchesOrderDate;
        });
    }, [products, searchTerm, orderAmount, orderDate]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getMostSoldProduct = () => {
        const productSales: Record<string, number> = {};

        filteredProducts.forEach((item: any) => {
            item.product.forEach((product: any) => {
                if (productSales[product.name]) {
                    productSales[product.name] += item.amount;
                } else {
                    productSales[product.name] = item.amount;
                }
            });
        });

        return Object.entries(productSales).reduce((max, product) =>
            product[1] > max[1] ? product : max, ['', 0] as [string, number])[0];
    };

    const getDayWithHighestSales = () => {
        const dateSales: Record<string, number> = {};

        filteredProducts.forEach((item: any) => {
            const date = formatDate(item.date);
            if (dateSales[date]) {
                dateSales[date] += item.amount;
            } else {
                dateSales[date] = item.amount;
            }
        });

        return Object.entries(dateSales).reduce((max, date) =>
            date[1] > max[1] ? date : max, ['', 0] as [string, number])[0];
    };

    return (
        <>
            <div className='navbar_container'>
                <p className='dashboard'>Dashboard</p>
                <p className='home'>Home</p>
            </div>
            <div className='items_container'>
                <div>
                    <div className='AllItemContainer'>
                        <div className='AllFilteriItem'>
                            <div className='filter_inputs'>
                                <input
                                    className='filter_inputs_items'
                                    type="text"
                                    placeholder="Search Product"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <input
                                    className='filter_inputs_items'
                                    type="number"
                                    placeholder="Order Amount"
                                    value={orderAmount}
                                    onChange={(e) => setOrderAmount(e.target.value)}
                                />
                                <input
                                    className='filter_inputs_items'
                                    type="date"
                                    value={orderDate}
                                    onChange={(e) => setOrderDate(e.target.value)}
                                />
                                <button className="filter-button">
                                    Filtrlə
                                </button>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th className='name_product'>Product Name</th>
                                        <th className='date_product'>Order Date</th>
                                        <th className='order_product'>Order Amount</th>
                                        <th className='price_product'>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={4}>No products found.</td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((item: any) =>
                                            item.product.map((product: any) => (
                                                <tr key={product._id}>
                                                    <td className='name_product_items'>{product.name}</td>
                                                    <td className='order_product_items'>{formatDate(item.date)}</td>
                                                    <td>{item.amount}</td>
                                                    <td>${product.price}</td>
                                                </tr>
                                            ))
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className='Line_all_container'>
                            <div className='line'>
                                <p>Statistika (Son 1 ay)</p>
                                <p>Ən çox satılan məhsul: {getMostSoldProduct()}</p>
                                <p>Ən çox satış olan gün: {getDayWithHighestSales()}</p>

                                <Line
                                    data={{
                                        labels: filteredProducts.map((item: any) => formatDate(item.date)),
                                        datasets: [
                                            {
                                                label: "Satış sayı",
                                                data: filteredProducts.map((item: any) => item.amount),
                                                backgroundColor: "rgba(6, 79, 240, 0.2)",
                                                borderColor: '#064FF0',
                                                borderWidth: 2,
                                                tension: 0.4,
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'top',
                                            },
                                            tooltip: {
                                                callbacks: {
                                                    label: (context) => {
                                                        return `${context.dataset.label}: $${context.raw}`;
                                                    },
                                                },
                                            },
                                        },
                                        scales: {
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: 'Order Date',
                                                },
                                            },
                                            y: {
                                                title: {
                                                    display: true,
                                                    text: 'Order Amount',
                                                },
                                                beginAtZero: true,
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Filter;
