# 2 λpat: A starting point

  [](
  We introduce a simply typed programming language λpat, which essentially extends the simply typed λ-calculus with pattern matching.
  We emphasize that there are no new contributions in this section.
  Instead, we primarily use λpat as an example to show how a type system is developed.
  In particularly, we show how various properties of λpat are chained together in order to establish the type soundness of λpat. 
  The subsequent development of the dependent type system in Section 4 and all of its extensions will be done in parallel to the development of λpat.
  Except Lemma 2.14, all the results in this section are well-known and thus their proofs are　omitted.
  )

  この章では基本的にパターンマッチングと単純に型付けされたλ計算を拡張し、単純に型付けされたプログラミング言語λpatを、紹介します。
  この章に新たな貢献はありません！
  その代わりに、主に例を通してλpatでの型システムがどのように開発されているかを示します。
  特に、λpatの様々な特性がλpatの型の健全性を確立するために、一緒に連携する方法を説明します。
  4章とその拡張のすべての依存型システムのその後の開発はλpatの発展に並行して行います。
  補題2.14を除いて、この章のすべての結果はよく知られているのでそれらの証明は省略します。

  ----

[](## Fig. 3. The syntax for λpat)

## 図3. λpat構文

    base types    δ ::= bool | int | . . .
    types         τ ::= δ | 1 | τ1 ∗ τ2 | τ1 → τ2
    patterns      p ::= x | f | hi | <p1, p2> | cc(p)
    matching clause seq. ms ::= (p1 ⇒ e1 | · · · | pn ⇒ en)
    constants     c ::= cc | cf
    expressions   e ::= xf | c(e) | hi | <e1, e2> | fst(e) | snd(e) | case e of ms |
                        lam x. e | e1(e2) | fix f. e | let x = e1 in e2 end
    values        v ::= x | cc(v) | hi | <v1, v2> | lam x. e
    contexts      Γ ::= · | Γ, xf : τ
    substitutions θ ::= [] | θ[x 7→ v] | θ[f 7→ e]

  [](
  The syntax of λpat is given in Figure 3.
  We use δ for base types such as int and bool and τ for types.
  We use x for lam-bound variables and f for fix-bound variables, and xf for either x or f.
  Given an expression e, we write FV(e) for the set of free variables xf in e, which is defined as usual.
  )

  λpatの構文を図3に示します。
  `int` と `bool` の基本型(base types)用の `δ` と、型(types)の `τ` を使います。
  `x` はlam-バインド変数、 `f` はfix-バインドされた変数で、 `xf` は `x` か `f` を表します。
  式 `e` が与えられたとき、`e` 内の自由変数 `xf` の集合を `FV(e)` と例によって定義します。

  ----

  [](
  A lam-bound variable is considered a value but a fix-bound variable is not.
  We use the name observable value for a closed value that does not contain a lambda expression lam x. e as its substructure.
  We use c for a constant, which is either a constant constructor cc or a constant function cf .
  Each constant c is assigned a constant type (or c-type, for short) of the form τ ⇒ δ.
  )

  lam-バインドされた変数は値ですがfix-バインド変数は値ではありません。
  我々はその基礎としてラムダ式の `lam x. e` が含まれていない閉じた値の名前に観察可能な値を使います。
  定数コンストラクタ `cc` か定数関数 `cf` のどちらかで定数(constants) `c` を使います。
  各定数 `c` は `τ ⇒ δ` 形式の定数型（略して、`c`型）を割り当てます。
  
  ----

  [](
  Note that a c-type is not regarded as a (regular) type.
  For each constant constructor cc assigned the type 1 ⇒ δ, we may write cc as a shorthand for cc(<>), where <> stands for the unit of the unit type 1.
  In the following presentation, we assume that the boolean values true and false are assigned the type 1 ⇒ bool and every integer i is assigned the type 1 ⇒ int.
  Note that we do not treat the tuple constructor <·, ·> as a special case of constructors.
  Instead, we introduce tuples into λpat explicitly.
  The primary reason for this decision is that tuples are to be handled specially in Section 5, where an elaboration procedure is presented for supporting a form of partial type inference in the presence of dependent types.
  )

  `c`型は(正規の)型とはみなさないことに注意してください。
  型 `1 ⇒ δ` を割り当てた各定数コンストラクタ `cc` では `cc(<>)` の省略形として `cc` と書き、 `<>` がユニット型1のユニットを表します。
  以下の内容では `true` と `false` の `bool` 値は `1 ⇒ bool` 型を割り当て、すべての整数 `i` が `1 ⇒ int` 型を割り当てることを前提としています。
  コンストラクタの特殊なケースとして、タプルコンストラクタ `<·, ·>` を扱わないことに注意してください。
  その代わりに、明示的にλpatにタプルを導入します。
  このように決めた主な理由は5章で詳しく扱いますが、タプルの詳細な手順は依存型の存在下で部分的な型推論の形式をサポートするために提示しています。

  ----

  [](
  We use θ for a substitution, which is a finite mapping that maps lam-bound variables x to values and fix-bound variables to fixed-point expressions.
  We use [] for the empty substitution and θ[xf 7→ e] for the substitution that extends θ with a link from xf to e, where it is assumed that xf is not in the domain dom(θ) of θ.
  Also, we may write [xf1 |-> e1,..., xf n |-> en] for a substitution that maps xf i to ei for 1 ≤ i ≤ n.
  We omit the further details on substitution, which are completely standard.
  Given a piece of syntax • (representing expressions, evaluation contexts, etc.), we use •[θ] for the result of applying θ to •.
  )

  lam-bound変数 `x` から値へ、fix-bound変数から固定小数点式へマッピングする有限の写像である置換に `θ` を使います。
  空の置換に `[]` を使い、 `xf` から `e` までのリンクを `θ` を拡張した置換 `θ[xf |→ e]` を使います。ここでの `xf` は `θ` のドメイン `dom(θ)` に登録していないものとします。
  また、 `1 ≤ i ≤ n` の範囲で `xfi` から `ei` へマップの置換を `[xf1 |-> e1,..., xf n |-> en]` と記述出来ます。
  完全に標準的な置換に関する詳細な説明は省略します。
  構文 `•` (式や評価コンテキスト等を表す)が与えられたとき、`θ` を `•` に適用した結果として `•[θ]` を使います。

  ----

  [](
  We use ∅ for the empty context and Γ, xf : τ for the context that extends Γ with one additional declaration xf : τ , where we assume that xf is not already declared in Γ.
  A context `Γ = ∅, xf: τ1,...,xfn: τn` may also be treated as a finite mapping that maps xfi to τi for 1 ≤ i ≤ n, and we use dom(Γ) for the domain of Γ. 
  Also, we may use Γ, Γ' for the context ∅, xf': τ1, ..., xfn : τn, xf'1 : τ'1,..., xf'n: τ'n , where Γ = ∅, xf 1: τ1,..., xfn : τn' and Γ' = ∅, xf'1: τ'1,..., xf'n: τ'n' and all variables xf1,...,xfn,xf'1,...,xf'n' are distinct.
  )

  空のコンテキストに対して `∅` を使い、`xf`　がすでに　`Γ`　で宣言されていないと仮定して一つの追加の宣言 `xf : τ` で `Γ` を拡張したコンテキスト `Γ, xf : τ` を使います。
  コンテキスト `Γ = ∅, xf: τ1,...,xfn: τn` はまた `1 ≤ i ≤ n` の範囲で `xfi` から `τi` への有限のマッピングとして処理可能で、 `Γ` のドメインである `dom(Γ)` を使います。
  また、コンテキスト `∅,xf': τ1, ..., xfn : τn, xf'1 : τ'1,..., xf'n: τ'n` で `Γ, Γ'` を使用出来ます。ここで `Γ = ∅, xf1: τ1,..., xfn : τn'` かつ `Γ' = ∅, xf'1: τ'1,..., xf'n: τ'n'` のときに、`xf1,...,xfn,xf'1,...,xf'n'` の全変数は異なる値を持ちます。

  ----

  [](
  As a form of syntactic sugar, we may write let <x1, x2> = e1 in e2 end for the following expression:
  )

  構文糖の形として、次の式を `let <x1, x2> = e1 in e2 end` と書くことがあります:

    let x = e1 in let x1 = fst(x) in let x2 = snd(x) in e2 end end end

  [](
  where x is assumed to have no free occurrences in e1, e2.
  )

  ここで、 `x` は `e1` と `e2` に自由変数として出現しないと仮定しています。
