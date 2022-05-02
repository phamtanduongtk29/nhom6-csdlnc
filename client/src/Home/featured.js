import { Link } from "react-router-dom";

import styles from "./index.module.scss";

import axioisClient from "../axios";
import { useLayoutEffect, useState } from "react";

export default function FeaturedProduct() {
  const [list_product, setList_Product] = useState([]);

  // lấy sản phẩm nổi bật của sản phẩm
  useLayoutEffect(() => {
    axioisClient.get("http://localhost:5000/").then((res) => {
      setList_Product(res);
      console.log(res);
    });
  }, []);

  return (
    <>
      <div id={styles.content}>
        <div id={styles.header_title}>
          <h1>Sản phẩm nổi bật</h1>
        </div>
        <div id={styles.list_product}>
          {list_product.map((item, index) => {
            return (
              <div className={styles.list_product_item} key={index}>
                <div className={styles.classify}>
                  <span>{item.data[0].classify}</span>
                </div>
                <div className="product_item">
                  {item.data.map((item2) => {
                    return (
                      <Link to="" className="items" key={item2._id}>
                        <div
                          className="image"
                          style={{
                            backgroundImage: `url('${item2.image}')`,
                          }}
                        ></div>
                        <div className="product_information">
                          <div className="product_name">
                            <span>{item2.name}</span>
                          </div>
                          <div className="product_price">
                            <span>{item2.price}đ</span>
                          </div>
                        </div>
                        <div className="details_btn">
                          <span>Chi tiết</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div className={styles.views_all_product}>
                  <Link to={`san-pham/${item.data[0].classify}`}>Tất Cả sản phẩm</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
