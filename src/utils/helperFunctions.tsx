export const numberToWords = (num: number) => {
    const ones = [
      'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];
    const tens = [
      '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
    ];
  
    if (num < 20) return ones[num];
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return `${tens[ten]}${one ? '-' + ones[one] : ''}`;
  };