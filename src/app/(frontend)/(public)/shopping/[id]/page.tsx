export default async function ShopPage({ params }: { params: { id: string } }) {
  const { id } = await params

  return <div>Shop Page {id}</div>
}
