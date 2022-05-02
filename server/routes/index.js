
const AccountController = require("../controller/AccountController");
const ProductController = require("../controller/ProductController");
const CartController = require("../controller/CartController");
const BillController = require("../controller/BillController");

const {cloudinary} = require("../cloudinary/index")

function routes(app) {

    // render home
    app.get("/", async (req, res) => {
        const qr = await ProductController.getHome();
        return res.json(qr);
      });
      
      // chức năng đăng nhập(user)
      app.post("/login", (req, res) => {
        try {
          AccountController.handle_login(req, res);
        } catch (error) {}
      });
      
      // chức năng đăng ký
      app.post("/register", (req, res) => {
        try {
          AccountController.handle_register(req, res);
        } catch (error) {}
      });
      
      // render sản phẩm theo từng thương hiệu
      app.get("/san-pham/:slug", async (req, res) => {
        const classify = req.params.slug;
        const data = await ProductController.getProductByClassify(classify, true);
        return res.json(data);
      });
      
      // thêm sản phẩm và giỏ
      app.post("/add-to-cart", async (req, res) => {
        const data = await CartController.add_to_cart(req);
        res.json(data);
      });
      
      // lấy ra những sản phẩm chưa thanh toán trong giỏ
      app.get("/user/carts", async (req, res) => {
        const data = await CartController.getAllCartByUserId(req.body.user_id);
        return res.json(data);
      });
      
      // chức năng thanh toán
      app.post("/user/payment", async (req, res) => {
        const order_list = JSON.stringify([
          "625ed7337095a55fef2ddcfd",
          "625ed70e7095a55fef2ddcf8",
        ]);
        return res.json(
          await BillController.payment({
            ...req.body,
            order_list,
          })
        );
      });
      
      // lấy ra những đơn hàng đã thanh toán của user
      app.get("/bill", async (req, res) => {
        const data = await BillController.getBillById(req.body.user_id);
        return res.json(data);
      });
      
      app.get(
        "/admin/all-user",
        (req, res, next) => {
          const role = req.body.role;
          if (role === "USER_ROLE") {
            return res.json({
              err: true,
              mess: "You are not admin !!!",
            });
          }
          return next();
        },
        async (req, res) => {
          try {
            const accounts = await AccountController.getAllAccount();
            return res.json({
              err: false,
              mess: "Success !!",
              data: accounts,
            });
          } catch (error) {
            return {
              err: false,
              mess: "Falid !!!",
              data: [],
            };
          }
        }
      );
      
      
      
      // thêm sản phẩm (chưa xong -> chỉ mới thêm được ảnh)
      app.post("/profile", async(req,res ) => {
        try {
          const file = req.body.data
          const uploadRespone = await cloudinary.v2.uploader.upload(file,{
            upload_preset:"duong"
          })
          console.log(file);
          console.log(uploadRespone);
          res.json("Success")
        } catch (error) {
          res.json("falid")
        }
      })
      
      
      // lấy ra tất cả các sản phẩm(chưa xong -> chỉ mới lấy ra được ảnh)
      
      app.get("/profile", async(req, res) => {
       const {resources} =  await cloudinary.v2.search.expression('folder:duong')
       .sort_by('public_id','desc')
       .max_results(30)
       .execute();
      
       res.json(resources)
      })
}

module.exports = routes