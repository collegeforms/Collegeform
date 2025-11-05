import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../main-component/router/context/CartContext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge } from "@mui/material";

const CartIcon = () => {
  const { cartCount } = useCart();

  return (
    <Link to="/cart" className="text-decoration-none position-relative">
      <Badge 
        badgeContent={cartCount} 
        color="primary"
        overlap="circular"
      >
        <ShoppingCartIcon 
          style={{ 
            fontSize: 28, 
            color: '#547DBC',
            cursor: 'pointer'
          }} 
        />
      </Badge>
    </Link>
  );
};

export default CartIcon;