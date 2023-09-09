import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { isValidNumber } from "../utils/helper";
import { ThemeContext } from "./Navbar";
const IngredientInput = (props) => {
  const theme = useContext(ThemeContext) || localStorage.getItem("theme");
  const [listIngredients, setListIngredients] = useState(
    props.listIngredients?.slice() || []
  );

  const [quantities, setQuantities] = useState(
    listIngredients?.map((item) => item.quantity || "")
  );
  const [units, setUnits] = useState(
    listIngredients?.map((item) => item.product.unit || "")
  );
  const [listNames, setNames] = useState(
    listIngredients?.map((item) => item.product.name || "")
  );
  const [listId, setlistId] = useState(
    listIngredients?.map((item) => item.product.id || "")
  );

  //tao mang de luu gia trị ban dau
  const [ingredients, setIngredients] = useState(() => {
    const filteredList = props.ingredients?.filter((item) => {
      return !listIngredients.some((ingr) => ingr.product?.id == item.id);
    });

    return filteredList;
  });

  const handleFilterIngredient = (a, b, c, d) => {
    setlistId(a);
    setUnits(b);
    setNames(c);
    setQuantities(d);
    const filteredList = props.ingredients.filter((item) => {
      return !a.some((ingr) => ingr == item.id);
    });
    setIngredients(filteredList);
    props.handleSetData(() => {
      const data = [];
      for (var i = 0; i < props.numOfI; i++) {
        data.push({
          id: a[i],
          quantity: d[i],
        });
      }
      return data;
    });
  };

  useEffect(() => {
    if (props.isChanged) {
      const newUnits = [];
      const newlistNames = [];
      const newlistIds = [];
      const newQuantites = [];

      for (var i = 0; i < props.numOfI; i++) {
        newUnits.push(props.ingredients[i]?.unit);
        newlistNames.push(props.ingredients[i]?.name);
        newlistIds.push(props.ingredients[i]?.id);
        newQuantites.push(1);
      }

      handleFilterIngredient(newlistIds, newUnits, newlistNames, newQuantites);
    }
  }, [props.numOfI]);

  var indents = [];
  for (var i = 0; i < props.numOfI; i++) {
    const index = i;
    indents.push(
      <div className=" flex items-center justify-between border rounded-lg mb-3 px-4">
        <select
          name=""
          id=""
          className="bg-transparent w-[200px] h-[40px] rounded border border-black"
          onChange={(e) => {
            const newUnits = [...units];
            newUnits[index] =
              e.target.options[e.target.selectedIndex].getAttribute(
                "data-unit"
              );

            const newlistName = [...listNames];
            newlistName[index] =
              e.target.options[e.target.selectedIndex].getAttribute(
                "data-name"
              );

            const newlistIds = [...listId];
            newlistIds[index] = e.target.value;

            handleFilterIngredient(
              newlistIds,
              newUnits,
              newlistName,
              quantities
            );
          }}
        >
          <option
            className="bg-transparent text-black"
            selected="selected"
            key={listId[i]}
            value={listId[i]}
            data-unit={units[i]}
            data-name={listNames[i]}
          >
            {listNames[i]}
          </option>
          {ingredients.map((item) => (
            <option
              className="bg-transparent text-black"
              key={item.id}
              value={item.id}
              data-unit={item.unit}
              data-name={item.name}
            >
              {item.name}
            </option>
          ))}
        </select>
        <input
          required
          className={`m-2 p-2 bg-transparent  border border-black`}
          type="text"
          placeholder="Số lượng"
          name=""
          id=""
          value={quantities[index] || ""}
          onChange={(e) => {
            const newlistQuantity = [...quantities];
            newlistQuantity[index] = e.target.value;
            setQuantities(newlistQuantity);
            handleFilterIngredient(listId, units, listNames, newlistQuantity);
          }}
        />
        <input
          required
          className={`m-2 p-2 bg-transparent  border border-black`}
          type="text"
          name=""
          id=""
          readOnly={true}
          value={units[index] || "Đơn vị"}
        />
      </div>
    );
  }
  return indents;
};

export default IngredientInput;
