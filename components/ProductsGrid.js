import ProductCard from '/components/ProductCard';
export default function ProductsGrid({products,compact=false}){return <div className={`products-grid ${compact?'compact-grid':''}`}>{products.map((p,i)=><ProductCard key={p.id??p.slug??i} product={p} compact={compact}/>)}</div>}
