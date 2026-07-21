import { getCropImagePath, getCropOption } from './CropPicker';

describe('getCropOption', () => {
  it.each([
    ['Thanh long', '🐉'],
    ['Thanhlong', '🐉'],
    ['Nhãn', '🍇'],
    ['Lúa thơm', '🌾'],
    ['Lúa', '🌾'],
    ['Lua', '🌾'],
    ['Cà chua', '🍅'],
  ])('maps %s to its picker visual', (cropType, emoji) => {
    expect(getCropOption(cropType)?.emoji).toBe(emoji);
  });

  it('returns the same local image path used by picker and diary cards', () => {
    expect(getCropImagePath('Thanh long')).toBe('/crops/thanh-long.webp');
    expect(getCropImagePath('Thanhlong')).toBe('/crops/thanh-long.webp');
  });

  it('uses the supplied rice photos', () => {
    expect(getCropImagePath('Lúa thơm')).toBe('/crops/lua-thom.png');
    expect(getCropImagePath('Lúa nước')).toBe('/crops/lua-nuoc.png');
  });

  it.each([
    ['CHUỐI', 'chuoi'],
    ['chuoi', 'chuoi'],
    ['Cây Dừa', 'dua'],
    ['DAU PHONG', 'lac'],
    ['Khoai mì', 'san'],
    ['bắp', 'ngo'],
    ['Tôi trồng cây chuối tiêu', 'chuoi'],
    ['Vườn ĐẬU PHỘNG mới', 'lac'],
  ])('detects custom crop %s without case or accent sensitivity', (input, id) => {
    expect(getCropOption(input)?.id).toBe(id);
    expect(getCropImagePath(input)).toBe(`/crops/${id}.webp`);
  });
});
