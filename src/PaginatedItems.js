import ReactPaginate from "https://cdn.skypack.dev/react-paginate@7.1.3";
import Collapsible from "react-collapsible";
import React, {useState, useEffect} from 'react';

function Items({ currentItems }) {
  return (
    <div className="items">
    {currentItems && currentItems.map((item) => (
      <div>
        <Collapsible className="page-collapse" trigger={item.model} >
            <ul>
                <h5>Users:</h5>
                {item.users.map(user => (
                    <li key={user.ID}>{user.Username}</li>
                ))}
            </ul>
        </Collapsible>
      </div>
    ))}
      </div>
  );
}

function PaginatedItems({ itemsPerPage, items}) {
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = event.selected * itemsPerPage % items.length;
    
    setItemOffset(newOffset);
  };

  return (
    <>
      <Items currentItems={currentItems} />
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
}

export default PaginatedItems;